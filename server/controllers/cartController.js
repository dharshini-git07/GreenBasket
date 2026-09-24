import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Helper to get or create cart for authenticated user
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * @desc    Get current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price images stock ecoScore category shortDescription',
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], subtotal: 0, totalItems: 0 },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to cart
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const addQty = Math.max(1, parseInt(quantity, 10));

    // Verify product exists and fetch authoritative price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock' });
    }

    const cart = await getOrCreateCart(req.user._id);

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + addQty;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Maximum available stock is ${product.stock}`,
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price; // Update to current authoritative DB price
    } else {
      if (addQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock of ${product.stock}`,
        });
      }
      cart.items.push({
        product: product._id,
        quantity: addQty,
        price: product.price,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price images stock ecoScore category shortDescription',
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update item quantity in cart
 * @route   PUT /api/cart/:productId
 * @access  Private
 */
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const newQty = parseInt(quantity, 10);
    if (isNaN(newQty) || newQty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (newQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot exceed available stock of ${product.stock}`,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = newQty;
    cart.items[itemIndex].price = product.price;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price images stock ecoScore category shortDescription',
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price images stock ecoScore category shortDescription',
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: { items: [], subtotal: 0, totalItems: 0 },
    });
  } catch (error) {
    next(error);
  }
};
