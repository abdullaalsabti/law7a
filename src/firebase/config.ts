import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-2_gmqIg7rxon4CBudEHNBR-Lwfi6JDs",
  authDomain: "law7a-4ad28.firebaseapp.com",
  projectId: "law7a-4ad28",
  storageBucket: "law7a-4ad28.appspot.com",
  messagingSenderId: "314855914594",
  appId: "1:314855914594:web:bbf4459d2289255b9ee53b",
  measurementId: "G-ZEL4FGYR60",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
