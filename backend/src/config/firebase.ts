import admin from 'firebase-admin';
import { config } from './env';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(config.firebaseServiceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDb = admin.firestore();
