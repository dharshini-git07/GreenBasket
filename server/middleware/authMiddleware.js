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

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    let uid;
    let email;

    if (admin.apps.length > 0) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      uid = decodedToken.uid;
      email = decodedToken.email;
    } else {
      // Direct token verification fallback for development environments
      uid = req.headers['x-user-uid'] || 'dev-uid';
      email = req.headers['x-user-email'] || 'dev@greenbasket.com';
    }

    const user = await User.findOne({ firebaseUid: uid });
    req.user = user;
    req.firebaseUser = { uid, email };

    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }
};
