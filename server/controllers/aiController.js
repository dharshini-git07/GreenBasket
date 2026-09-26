import Product from '../models/Product.js';

/**
 * @desc    GreenGuide AI Assistant Endpoint
 * @route   POST /api/ai/green-guide
 * @access  Public
 */
export const handleGreenGuideQuery = async (req, res, next) => {
  try {
    const { message } = req.body;

    // 1. Input Validation & Rate/Input Protection
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question or message for GreenGuide AI.',
      });
    }

    const cleanedMessage = message.trim();
    if (cleanedMessage.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long. Please keep your request under 500 characters.',
      });
    }

    // 2. Retrieve Product Catalog from MongoDB Atlas
    const mongoProducts = await Product.find({}).lean();

    if (!mongoProducts || mongoProducts.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          message: "I couldn't find a product in our current catalog that matches those requirements. Try adjusting your budget or category. 🌱",
          recommendations: [],
          products: [],
        },
      });
    }

    // Map Mongo products for easy lookup by ID
    const productMap = new Map();
    mongoProducts.forEach((p) => {
      productMap.set(p._id.toString(), p);
    });

    // Prepare compact catalog payload for Gemini grounding
    const compactCatalog = mongoProducts.map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      shortDescription: p.shortDescription || p.description?.substring(0, 120),
      price: p.price,
      category: p.category,
      ecoScore: p.ecoScore,
      ecoAttributes: p.ecoAttributes || [],
      stock: p.stock,
      rating: p.rating,
    }));

    // System prompt & instructions for strict product grounding
    const systemInstruction = `You are GreenGuide AI, the sustainable shopping assistant for GreenBasket.
Your job is to help users discover suitable products from the GreenBasket catalog.

IMPORTANT RULES:
1. Recommend ONLY products provided in the catalog list below.
2. Never invent a product, product name, price, stock, or product ID.
3. Never claim a product is eco-friendly beyond the attributes provided.
4. Use the provided Eco Score and eco attributes when relevant.
5. If no product matches the user's request, clearly say that no suitable product was found.
6. Keep recommendations concise, friendly, and useful.
7. Return your response ONLY as valid JSON in this format:
{
  "message": "Friendly explanation of recommendations 🌱",
  "recommendations": [
    {
      "productId": "actual-mongodb-product-id",
      "reason": "Short reason why this fits the query"
    }
  ]
}`;

    const promptText = `${systemInstruction}

AVAILABLE CATALOG:
${JSON.stringify(compactCatalog, null, 2)}

USER REQUEST:
"${cleanedMessage}"`;

    let aiResult = null;
    const apiKey = process.env.GEMINI_API_KEY;

    // 3. Query Gemini API if API key is provided
    if (apiKey && apiKey.trim()) {
      try {
        const geminiModels = ['gemini-2.5-flash', 'gemini-1.5-flash'];
        
        for (const modelName of geminiModels) {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-[#Type]': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [{ text: promptText }],
                    },
                  ],
                  generationConfig: {
                    temperature: 0.2,
                    responseMimeType: 'application/json',
                  },
                }),
              }
            );

            if (response.ok) {
              const resData = await response.json();
              const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (responseText) {
                // Clean potential markdown wrap
                const jsonCleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                aiResult = JSON.parse(jsonCleaned);
                if (aiResult && aiResult.message) {
                  break; // Successful Gemini invocation
                }
              }
            }
          } catch (modelErr) {
            console.warn(`[GreenGuide AI] Warning trying ${modelName}:`, modelErr.message);
          }
        }
      } catch (geminiErr) {
        console.error('[GreenGuide AI] Gemini API call exception:', geminiErr.message);
      }
    }

    // 4. Fallback Grounded Rule Engine if Gemini API key missing/unreachable
    if (!aiResult || !aiResult.message) {
      aiResult = generateFallbackGroundedResponse(cleanedMessage, compactCatalog);
    }

    // 5. Strict Response Validation & Product ID Verification
    const rawRecommendations = Array.isArray(aiResult.recommendations) ? aiResult.recommendations : [];
    const validRecommendations = [];
    const recommendedProductList = [];

    for (const rec of rawRecommendations) {
      if (rec && rec.productId && productMap.has(rec.productId.toString())) {
        const fullProduct = productMap.get(rec.productId.toString());
        validRecommendations.push({
          productId: fullProduct._id.toString(),
          reason: rec.reason || `Matches query for ${fullProduct.category} with Eco Score ${fullProduct.ecoScore}/100.`,
        });
        recommendedProductList.push(fullProduct);
      }
    }

    // Handle case where no valid products matched
    if (validRecommendations.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          message: "I couldn't find a product in our current catalog that matches those requirements. Try adjusting your budget or category. 🌱",
          recommendations: [],
          products: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        message: aiResult.message || 'Here are a few sustainable options that match your needs 🌱',
        recommendations: validRecommendations,
        products: recommendedProductList,
      },
    });
  } catch (error) {
    console.error('[GreenGuide AI Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'GreenGuide is temporarily unavailable. Please try again.',
    });
  }
};

/**
 * Smart Fallback Engine grounded on actual MongoDB catalog
 */
function generateFallbackGroundedResponse(userQuery, catalog) {
  const queryLower = userQuery.toLowerCase();
  
  // Extract budget limit if mentioned in query (e.g. under 1500, under ₹1000)
  const budgetMatch = queryLower.match(/(?:under|below|less than|within|₹|\$)\s*(\d+)/i) || queryLower.match(/(\d+)\s*(?:rupees|inr|rs|₹)/i);
  const maxBudget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;

  // Filter products by budget, category, keywords or eco score
  let matches = catalog.filter((p) => {
    if (maxBudget && p.price > maxBudget) return false;

    if (queryLower.includes('kitchen') && p.category.toLowerCase().includes('kitchen')) return true;
    if (queryLower.includes('home') && (p.category.toLowerCase().includes('home') || p.category.toLowerCase().includes('kitchen'))) return true;
    if (queryLower.includes('care') || queryLower.includes('personal') || queryLower.includes('beauty')) {
      if (p.category.toLowerCase().includes('personal') || p.category.toLowerCase().includes('beauty')) return true;
    }
    if (queryLower.includes('gift') || queryLower.includes('reusable') || queryLower.includes('plastic-free')) return true;
    if (queryLower.includes('high') || queryLower.includes('eco score') || queryLower.includes('best')) {
      if (p.ecoScore >= 85) return true;
    }

    // Generic match against name or description
    const text = `${p.name} ${p.shortDescription} ${p.category}`.toLowerCase();
    const words = queryLower.split(/\s+/).filter((w) => w.length > 3);
    return words.some((w) => text.includes(w));
  });

  // If no specific keyword match, return highest eco score products within budget
  if (matches.length === 0) {
    matches = catalog
      .filter((p) => !maxBudget || p.price <= maxBudget)
      .sort((a, b) => b.ecoScore - a.ecoScore)
      .slice(0, 3);
  }

  if (matches.length === 0) {
    return {
      message: "I couldn't find a product in our current catalog that matches those requirements. Try adjusting your budget or category. 🌱",
      recommendations: [],
    };
  }

  // Top 3 recommendations max
  const topMatches = matches.slice(0, 3);

  return {
    message: maxBudget
      ? `Here are sustainable options from our catalog within ₹${maxBudget} 🌱`
      : 'Here are a few sustainable options from our catalog that match your request 🌱',
    recommendations: topMatches.map((p) => ({
      productId: p._id,
      reason: `Rated ${p.ecoScore}/100 Eco Score in ${p.category}. Reusable and eco-friendly.`,
    })),
  };
}
