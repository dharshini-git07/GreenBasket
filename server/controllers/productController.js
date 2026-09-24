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
    const products = await Product.find({ featured: true }).sort({ productNumber: 1 }).limit(8);
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
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id });
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
 * @desc    Create a product (Admin)
 * @route   POST /api/products
 * @access  Private / Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product (Admin)
 * @route   PUT /api/products/:id
 * @access  Private / Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product (Admin)
 * @route   DELETE /api/products/:id
 * @access  Private / Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
