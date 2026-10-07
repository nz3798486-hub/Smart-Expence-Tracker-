import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// User provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDiHfY0EAuPvkmKO-HgwUs1XYIDehw4L4s",
  authDomain: "urdu-stamp-lexicon.firebaseapp.com",
  projectId: "urdu-stamp-lexicon",
  storageBucket: "urdu-stamp-lexicon.firebasestorage.app",
  messagingSenderId: "372591465011",
  appId: "1:372591465011:web:1ff75bbce9a9a1bd400946"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
