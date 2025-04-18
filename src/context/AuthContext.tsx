import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "../types";
import { auth } from "../firebase/config";
import {
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  logoutUser,
  getCurrentUserData
} from "../firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (userData: {
    name: string;
    email: string;
    password: string;
    isArtist: boolean;
  }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = await getCurrentUserData(firebaseUser);
        setCurrentUser(userData);
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await loginWithEmailAndPassword(email, password);
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    isArtist: boolean;
  }): Promise<boolean> => {
    try {
      const user = await registerWithEmailAndPassword(
        userData.email,
        userData.password,
        userData.name,
        userData.isArtist
      );
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        signUp,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
