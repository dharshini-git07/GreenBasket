import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * @desc    Create a new order from active user cart
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'COD' } = req.body;

    // 1. Validate shipping address fields
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required shipping details.',
      });
    }

    // 2. Fetch authenticated user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items before checking out.',
      });
    }

    // 3. Verify product availability & stock in database
    const orderItems = [];
    let calculatedSubtotal = 0;

    for (const item of cart.items) {
      if (!item.product) continue;
      const productId = item.product._id ? item.product._id : item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'One or more items in your cart are no longer available.',
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is out of stock or requested quantity exceeds available stock.`,
        });
      }

      const itemPrice = product.price; // Authoritative DB price
      calculatedSubtotal += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        owner: product.owner,
        name: product.name,
        image: product.images?.[0] || '/products/product-01.jpg',
        price: itemPrice,
        quantity: item.quantity,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.',
      });
    }

    // 4. Calculate authoritative shipping & total
    const shippingFee = calculatedSubtotal >= 999 ? 0 : 99;
    const finalTotal = calculatedSubtotal + shippingFee;

    // 5. Create Order document
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      subtotal: calculatedSubtotal,
      shipping: shippingFee,
      total: finalTotal,
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
    });

    // 6. Safely decrement stock for ordered products
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 7. Clear user's cart in database
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Your order is on its greener journey! 🌱',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's order history
 * @route   GET /api/orders
 * @access  Private
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order details by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Authorization check: user must own order or be admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
