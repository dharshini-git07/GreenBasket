import admin from 'firebase-admin';

let firebaseAdminApp = null;

export const initFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    firebaseAdminApp = admin.apps[0];
    return firebaseAdminApp;
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseAdminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('[Firebase Admin] Initialized with Service Account JSON');
    } else {
      firebaseAdminApp = admin.initializeApp();
      console.log('[Firebase Admin] Initialized with default credentials');
    }
  } catch (err) {
    console.warn('[Firebase Admin Warning] Running without service account config. Token verification will fall back to local token validation if needed:', err.message);
  }

  return firebaseAdminApp;
};
