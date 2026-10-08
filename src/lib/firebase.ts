import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import localConfig from '../../firebase-applet-config.json';

// Use environment variables (standard for Vercel/production) or fall back to local config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId,
};

const databaseId =
  import.meta.env.VITE_FIREBASE_DATABASE_ID ||
  localConfig.firestoreDatabaseId ||
  undefined;

// Initialize Firebase App (singleton)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if configured, or default
export const db =
  databaseId && databaseId !== '(default)'
    ? getFirestore(app, databaseId)
    : getFirestore(app);

export { doc, onSnapshot, setDoc, deleteDoc, serverTimestamp };
