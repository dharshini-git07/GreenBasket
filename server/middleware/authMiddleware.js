import admin from 'firebase-admin';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    let uid;
    let email;

    if (admin.apps.length > 0) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        uid = decodedToken.uid;
        email = decodedToken.email;
      } catch (tokenErr) {
        console.error('[Firebase Token Verification Failed]:', tokenErr.message);
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token',
        });
      }
    } else {
      uid = req.headers['x-user-uid'] || 'dev-uid';
      email = req.headers['x-user-email'] || 'dev@greenbasket.com';
    }

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid user token',
      });
    }

    let user = await User.findOne({ firebaseUid: uid });

    // Auto-synchronize user if authenticated in Firebase but not yet synced to MongoDB Atlas
    if (!user && email) {
      user = await User.create({
        firebaseUid: uid,
        name: email.split('@')[0],
        email: email,
        role: 'user',
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found',
      });
    }

    req.user = user;
    req.firebaseUser = { uid, email };

    next();
  } catch (error) {
    console.error('[Auth Middleware Exception]:', error.message);
    res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required.',
    });
  }
};
