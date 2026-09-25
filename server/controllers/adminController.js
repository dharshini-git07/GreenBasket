import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/stats
 * @access  Private / Admin
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products for Admin
 * @route   GET /api/admin/products
 * @access  Private / Admin
 */
export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('owner', 'name email role')
      .sort({ productNumber: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create product as Admin
 * @route   POST /api/admin/products
 * @access  Private / Admin
 */
export const createAdminProduct = async (req, res, next) => {
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
      ecoAttributes,
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
      owner: req.user._id,
      ecoAttributes: ecoAttributes || {
        reusable: true,
        sustainableMaterial: true,
        plasticFree: true,
      },
      productNumber: (await Product.countDocuments()) + 1,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product as Admin
 * @route   PUT /api/admin/products/:id
 * @access  Private / Admin
 */
export const updateAdminProduct = async (req, res, next) => {
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
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product as Admin
 * @route   DELETE /api/admin/products/:id
 * @access  Private / Admin
 */
export const deleteAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders for Admin
 * @route   GET /api/admin/orders
 * @access  Private / Admin
 */
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status as Admin
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private / Admin
 */
export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (orderStatus && !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users for Admin
 * @route   GET /api/admin/users
 * @access  Private / Admin
 */
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Admin Sellers view (Users with at least 1 product listed)
 * @route   GET /api/admin/sellers
 * @access  Private / Admin
 */
export const getAdminSellers = async (req, res, next) => {
  try {
    const sellerUserIds = await Product.distinct('owner');
    const sellers = await User.find({ _id: { $in: sellerUserIds } }).select('-password').sort({ createdAt: -1 });

    const sellersWithStats = await Promise.all(
      sellers.map(async (seller) => {
        const productCount = await Product.countDocuments({ owner: seller._id });
        return {
          _id: seller._id,
          name: seller.name,
          email: seller.email,
          role: seller.role,
          productsListed: productCount,
          createdAt: seller.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      sellers: sellersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Admin Buyers view (Users with at least 1 order placed)
 * @route   GET /api/admin/buyers
 * @access  Private / Admin
 */
export const getAdminBuyers = async (req, res, next) => {
  try {
    const buyerUserIds = await Order.distinct('user');
    const buyers = await User.find({ _id: { $in: buyerUserIds } }).select('-password').sort({ createdAt: -1 });

    const buyersWithStats = await Promise.all(
      buyers.map(async (buyer) => {
        const userOrders = await Order.find({ user: buyer._id });
        const ordersCount = userOrders.length;
        const totalSpent = userOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);

        return {
          _id: buyer._id,
          name: buyer.name,
          email: buyer.email,
          role: buyer.role,
          ordersCount,
          totalSpent,
          createdAt: buyer.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      buyers: buyersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Development helper to promote current user to Admin role
 * @route   POST /api/admin/make-admin
 * @access  Private
 */
export const makeUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: 'admin' },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Role updated to admin successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
};
