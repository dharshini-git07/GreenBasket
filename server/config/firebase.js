import admin from 'firebase-admin';

let firebaseAdminApp = null;

export const initFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    firebaseAdminApp = admin.apps[0];
    return firebaseAdminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'greenbasket-4a459';

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim() !== '') {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        firebaseAdminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id || projectId,
        });
        console.log('[Firebase Admin] Initialized successfully with Service Account JSON');
        return firebaseAdminApp;
      } catch (jsonErr) {
        console.warn('[Firebase Admin Warning] Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON string. Falling back to Project ID config.');
      }
    }

    firebaseAdminApp = admin.initializeApp({
      projectId,
    });
    console.log(`[Firebase Admin] Initialized successfully for Firebase Project ID: "${projectId}"`);
  } catch (err) {
    console.warn('[Firebase Admin Warning] Initialization error:', err.message);
  }

  return firebaseAdminApp;
};

export default initFirebaseAdmin;
