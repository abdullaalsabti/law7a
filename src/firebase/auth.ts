import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { User } from "../types";

// Sign up with email and password
export const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
  isArtist: boolean
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with name
    await updateProfile(user, {
      displayName: name
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name,
      email,
      isArtist,
      createdAt: new Date().toISOString()
    });
    
    // Return user data
    return {
      id: user.uid,
      name,
      email,
      isArtist,
      profilePicture: user.photoURL || undefined
    };
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Sign in with email and password
export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: user.uid,
        name: userData.name || user.displayName || "",
        email: userData.email || user.email || "",
        isArtist: userData.isArtist || false,
        profilePicture: userData.profilePicture || user.photoURL || undefined
      };
    } else {
      throw new Error("User data not found in database");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Sign out
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (user: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: user.uid,
        name: userData.name || user.displayName || "",
        email: userData.email || user.email || "",
        isArtist: userData.isArtist || false,
        profilePicture: userData.profilePicture || user.photoURL || undefined
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};
