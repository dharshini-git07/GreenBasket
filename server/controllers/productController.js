import Product from '../models/Product.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all products with filtering, search, sorting & pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      ecoScore,
      sort, 
      page = 1, 
      limit = 12 
    } = req.query;

    const query = {};

    // Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search Query (regex across name, description, category)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Eco Score Filter
    if (ecoScore) {
      query.ecoScore = { $gte: Number(ecoScore) };
    }

    // Sorting Options
    let sortOptions = {};
    switch (sort) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'eco-score':
        sortOptions = { ecoScore: -1 };
        break;
      case 'recommended':
      default:
        sortOptions = { productNumber: 1 };
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('owner', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true })
      .populate('owner', 'name email')
      .sort({ productNumber: 1 })
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's listed products
 * @route   GET /api/products/my-products
 * @access  Private (User/Admin)
 */
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID or Slug
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).populate('owner', 'name email');
    }
    if (!product) {
      product = await Product.findOne({ slug: id }).populate('owner', 'name email');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a product (Any authenticated user can list a product for sale)
 * @route   POST /api/products
 * @access  Private (User / Admin)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { 
      name, 
      price, 
      category, 
      stock, 
      ecoScore, 
      description, 
      shortDescription, 
      images,
      image,
      featured,
      ecoAttributes 
    } = req.body;

    if (!name || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: Product Name, Price, Category, and Stock.',
      });
    }

    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const imageList = [];
    if (images && Array.isArray(images) && images.length > 0) {
      imageList.push(...images);
    } else if (image) {
      imageList.push(image);
    } else {
      imageList.push('/products/product-01.jpg');
    }

    const count = await Product.countDocuments();

    const product = await Product.create({
      name: name.trim(),
      slug,
      price: Number(price),
      category: category.trim(),
      stock: Number(stock),
      ecoScore: Number(ecoScore || 90),
      description: description ? description.trim() : name.trim(),
      shortDescription: shortDescription ? shortDescription.trim() : (description || name).trim(),
      images: imageList,
      featured: Boolean(featured),
      owner: req.user._id, // Enforce authenticated MongoDB user as owner
      ecoAttributes: ecoAttributes || {
        reusable: true,
        sustainableMaterial: true,
        plasticFree: true,
      },
      productNumber: count + 1,
    });

    res.status(201).json({
      success: true,
      message: 'Product listed for sale successfully 🌱',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product (Owner or Admin only)
 * @route   PUT /api/products/:id
 * @access  Private (User / Admin)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Permission check: Must be Admin OR Product Owner
    const isOwner = product.owner && product.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only manage your own products.',
      });
    }

    // Prevent overwriting owner via request body
    const updateData = { ...req.body };
    delete updateData.owner;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product (Owner or Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private (User / Admin)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Permission check: Must be Admin OR Product Owner
    const isOwner = product.owner && product.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only manage your own products.',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
