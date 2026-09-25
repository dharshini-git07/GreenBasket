import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

/**
 * @desc    Get logged-in user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Upsert wishlist entry to prevent duplicates
    const item = await Wishlist.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { user: req.user._id, product: productId },
      { upsert: true, new: true, runValidators: true }
    ).populate('product');

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const deleted = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      productId,
    });
  } catch (error) {
    next(error);
  }
};
