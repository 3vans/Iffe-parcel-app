import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig as staticConfig } from "@/firebase/config";

/**
 * Checks if a value is a placeholder or undefined.
 */
const isPlaceholder = (val?: string) => !val || val === 'xxxxx' || val.includes('YOUR_') || val === 'undefined';

/**
 * Constructs the Firebase configuration, preferring environment variables 
 * but strictly falling back to static config if env vars are placeholders.
 */
const firebaseConfig = {
  apiKey: !isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) 
    ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY 
    : staticConfig.apiKey,
  authDomain: !isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
    ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    : staticConfig.authDomain,
  projectId: !isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
    ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    : staticConfig.projectId,
  storageBucket: !isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    : staticConfig.storageBucket,
  messagingSenderId: !isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)
    ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    : staticConfig.messagingSenderId,
  appId: !isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
    ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    : staticConfig.appId,
};

// Use the robust initialization pattern from your reference to prevent multiple app instances.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
