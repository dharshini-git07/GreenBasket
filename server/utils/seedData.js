import Product from '../models/Product.js';

export const initialProducts = [
  {
    productNumber: 1,
    name: 'Bamboo Cutlery & Straw Dining Kit',
    slug: 'bamboo-cutlery-straw-dining-kit',
    description: 'Handcrafted organic bamboo cutlery kit including fork, knife, spoon, chopsticks, straw, and cleaning brush in a washable organic cotton pouch. Zero-waste certified for dining on the go.',
    shortDescription: 'Zero-waste bamboo dining kit in travel pouch.',
    price: 899,
    category: 'Reusable',
    images: ['/products/product-01.jpg'],
    stock: 25,
    ecoScore: 96,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: true,
      sustainableMaterial: true,
      energyEfficient: false,
      organic: true,
    },
    rating: 4.9,
    reviewCount: 42,
    featured: true,
  },
  {
    productNumber: 2,
    name: 'Insulated Stainless Steel Water Bottle 750ml',
    slug: 'insulated-stainless-steel-water-bottle-750ml',
    description: 'Double-wall vacuum insulated food-grade 18/8 stainless steel bottle. Keeps drinks cold for 24 hours or hot for 12 hours without condensation. 100% BPA-free and leak-proof.',
    shortDescription: 'Double-wall vacuum insulated 18/8 stainless steel bottle.',
    price: 1299,
    category: 'Plastic-Free',
    images: ['/products/product-02.jpg'],
    stock: 30,
    ecoScore: 94,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: true,
      sustainableMaterial: true,
      energyEfficient: false,
      organic: false,
    },
    rating: 4.8,
    reviewCount: 38,
    featured: true,
  },
  {
    productNumber: 3,
    name: 'Organic Cotton Grocery Mesh Bags (Set of 6)',
    slug: 'organic-cotton-grocery-mesh-bags-set-of-6',
    description: 'GOTS certified organic cotton produce bags with drawstring closures. Includes 2 small, 2 medium, and 2 large mesh bags designed for plastic-free vegetable and fruit shopping.',
    shortDescription: 'GOTS certified organic cotton drawstring produce bags.',
    price: 649,
    category: 'Organic',
    images: ['/products/product-03.jpg'],
    stock: 40,
    ecoScore: 98,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: true,
      sustainableMaterial: true,
      energyEfficient: false,
      organic: true,
    },
    rating: 4.7,
    reviewCount: 29,
    featured: true,
  },
  {
    productNumber: 4,
    name: 'Solar Powered Outdoor LED Lantern',
    slug: 'solar-powered-outdoor-led-lantern',
    description: 'High-efficiency monocrystalline solar powered compact lantern with dual USB emergency power output. Waterproof IP67 casing made from recycled ABS polymer.',
    shortDescription: 'Solar powered waterproof lantern with power bank functionality.',
    price: 1899,
    category: 'Energy Saving',
    images: ['/products/product-04.jpg'],
    stock: 15,
    ecoScore: 95,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: false,
      sustainableMaterial: true,
      energyEfficient: true,
      organic: false,
    },
    rating: 4.9,
    reviewCount: 19,
    featured: true,
  },
  {
    productNumber: 5,
    name: 'Biodegradable Bamboo Toothbrush Pack of 4',
    slug: 'biodegradable-bamboo-toothbrush-pack-of-4',
    description: 'Ergonomic moso bamboo handle with soft charcoal-infused bristles. 100% compostable handles packaged in plastic-free recycled paper box.',
    shortDescription: 'Charcoal-infused soft bristle compostable bamboo toothbrushes.',
    price: 349,
    category: 'Personal Care',
    images: ['/products/product-05.jpg'],
    stock: 50,
    ecoScore: 92,
    ecoAttributes: {
      reusable: false,
      recyclable: true,
      plasticFree: true,
      sustainableMaterial: true,
      energyEfficient: false,
      organic: true,
    },
    rating: 4.6,
    reviewCount: 54,
    featured: false,
  },
  {
    productNumber: 6,
    name: 'Natural Plant-Based Dish Soap Bar & Coconut Scrubber',
    slug: 'natural-plant-based-dish-soap-bar-coconut-scrubber',
    description: 'Zero-waste solid dish washing soap block crafted with essential lemon oil and coconut oil. Includes non-scratch coconut husk scrub pad.',
    shortDescription: 'Solid plant-based dish soap bar with coconut fiber sponge.',
    price: 499,
    category: 'Sustainable Home',
    images: ['/products/product-06.jpg'],
    stock: 35,
    ecoScore: 93,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: true,
      sustainableMaterial: true,
      energyEfficient: false,
      organic: true,
    },
    rating: 4.7,
    reviewCount: 22,
    featured: false,
  },
  {
    productNumber: 7,
    name: 'Beeswax Food Wraps Sustainable Starter Kit',
    slug: 'beeswax-food-wraps-sustainable-starter-kit',
    description: 'Handmade organic cotton food wraps coated with sustainably harvested beeswax, jojoba oil, and tree resin. Replace single-use cling film.',
    shortDescription: 'Reusable beeswax food wraps for plastic-free food storage.',
    price: 799,
    category: 'Reusable',
    images: ['/products/product-07.jpg'],
    stock: 20,
    ecoScore: 91,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: true,
      sustainableMaterial: true,
      energyEfficient: false,
      organic: true,
    },
    rating: 4.5,
    reviewCount: 16,
    featured: false,
  },
  {
    productNumber: 8,
    name: 'Recycled Paper Hardcover Notebook (Dot Grid)',
    slug: 'recycled-paper-hardcover-notebook-dot-grid',
    description: '192 pages of 100% post-consumer recycled thick paper. Acid-free, fountain pen friendly dot grid pages with soy-based ink printing.',
    shortDescription: '100% post-consumer recycled paper dot grid hardcover journal.',
    price: 549,
    category: 'Sustainable Home',
    images: ['/products/product-08.jpg'],
    stock: 28,
    ecoScore: 89,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: true,
      sustainableMaterial: true,
      energyEfficient: false,
      organic: false,
    },
    rating: 4.8,
    reviewCount: 31,
    featured: false,
  },
  {
    productNumber: 9,
    name: 'Organic Shampoo & Conditioner Bar Duo',
    slug: 'organic-shampoo-conditioner-bar-duo',
    description: 'Nourishing solid shampoo and conditioner bars enriched with cold-pressed argan oil and French green clay. Equal to 4 plastic shampoo bottles.',
    shortDescription: 'Solid zero-plastic shampoo and conditioner bars.',
    price: 849,
    category: 'Personal Care',
    images: ['/products/product-09.jpg'],
    stock: 18,
    ecoScore: 97,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: true,
      sustainableMaterial: true,
      energyEfficient: false,
      organic: true,
    },
    rating: 4.9,
    reviewCount: 47,
    featured: true,
  },
  {
    productNumber: 10,
    name: 'Smart Energy Monitor Plug with Power Stats',
    slug: 'smart-energy-monitor-plug-with-power-stats',
    description: 'Wi-Fi smart plug with real-time power consumption monitoring and automated eco scheduling to eliminate phantom power waste.',
    shortDescription: 'Energy-saving smart plug with real-time power analytics.',
    price: 1499,
    category: 'Energy Saving',
    images: ['/products/product-10.jpg'],
    stock: 12,
    ecoScore: 88,
    ecoAttributes: {
      reusable: true,
      recyclable: true,
      plasticFree: false,
      sustainableMaterial: false,
      energyEfficient: true,
      organic: false,
    },
    rating: 4.4,
    reviewCount: 14,
    featured: false,
  }
];

import User from '../models/User.js';

export const seedProductsDB = async () => {
  try {
    let defaultOwner = await User.findOne({ role: 'admin' });
    if (!defaultOwner) {
      defaultOwner = await User.findOne();
    }
    if (!defaultOwner) {
      defaultOwner = await User.create({
        firebaseUid: 'system-admin-seed-uid',
        name: 'GreenBasket Admin',
        email: 'admin@greenbasket.com',
        role: 'admin',
      });
    }

    const count = await Product.countDocuments();
    const productsWithOwner = initialProducts.map((p) => ({
      ...p,
      owner: defaultOwner._id,
    }));

    if (count === 0) {
      await Product.insertMany(productsWithOwner);
      console.log(`[Seed Success] Inserted ${initialProducts.length} initial eco products into MongoDB with numbers 1 to 10.`);
    } else {
      for (const item of initialProducts) {
        await Product.updateOne(
          { slug: item.slug },
          { $set: { productNumber: item.productNumber, images: item.images } }
        );
      }
      await Product.updateMany(
        { owner: { $exists: false } },
        { $set: { owner: defaultOwner._id } }
      );
      console.log(`[Seed Success] Updated ${initialProducts.length} products in MongoDB Atlas with sequential product numbers 1 to 10 and valid owner.`);
    }
  } catch (err) {
    console.error('[Seed Error] Failed to seed/update product database:', err.message);
  }
};
