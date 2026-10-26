import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import localConfig from '../../firebase-applet-config.json';

const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const isUsingCustomEnvProject =
  Boolean(envProjectId) && envProjectId !== localConfig.projectId;

// Use environment variables (standard for Vercel/production) or fall back to local config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain,
  projectId: envProjectId || localConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId,
};

// Only use localConfig.firestoreDatabaseId if we are connecting to the same project
const databaseId = isUsingCustomEnvProject
  ? import.meta.env.VITE_FIREBASE_DATABASE_ID || undefined
  : import.meta.env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || undefined;

// Initialize Firebase App (singleton)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with ignoreUndefinedProperties enabled so optional fields never break setDoc
function initDb(): Firestore {
  try {
    return databaseId && databaseId !== '(default)'
      ? initializeFirestore(app, { ignoreUndefinedProperties: true }, databaseId)
      : initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch {
    return databaseId && databaseId !== '(default)'
      ? getFirestore(app, databaseId)
      : getFirestore(app);
  }
}

export const db = initDb();

export { doc, onSnapshot, setDoc, deleteDoc, serverTimestamp };

