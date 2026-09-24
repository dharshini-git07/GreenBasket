import User from '../models/User.js';

/**
 * @desc    Sync Firebase authenticated user with MongoDB Atlas
 * @route   POST /api/users/sync
 * @access  Public / Authenticated
 */
export const syncUser = async (req, res, next) => {
  try {
    const { firebaseUid, name, email, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        message: 'firebaseUid and email are required for sync',
      });
    }

    let user = await User.findOne({ firebaseUid });

    if (user) {
      user.name = name || user.name;
      user.photoURL = photoURL || user.photoURL;
      await user.save();
    } else {
      user = await User.create({
        firebaseUid,
        name: name || email.split('@')[0],
        email,
        photoURL: photoURL || '',
        role: 'user',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User synchronized successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current User Profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found in database',
      });
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
