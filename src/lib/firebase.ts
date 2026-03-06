import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig as staticConfig } from "@/firebase/config";

// Use environment variables if available, otherwise fallback to the static config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || staticConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || staticConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || staticConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || staticConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || staticConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || staticConfig.appId,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
