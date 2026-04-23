import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAoYgX5K6IgEnSbleKxME4kOPUGUiVkkJ4",
  authDomain: "travelease-4d3c8.firebaseapp.com",
  projectId: "travelease-4d3c8",
  storageBucket: "travelease-4d3c8.firebasestorage.app",
  messagingSenderId: "746250871009",
  appId: "1:746250871009:web:3240942acce946bfef17a0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);