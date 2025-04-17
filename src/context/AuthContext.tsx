import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../types";
import { mockUsers } from "../utils/mockData";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would make an API call to validate credentials
    // For demo, we're using mock data and simplifying authentication
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const user = mockUsers.find((user) => user.email === email);

      if (user) {
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    isArtist: boolean;
  }): Promise<boolean> => {
    // In a real app, you would make an API call to register the user
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if email already exists
      const existingUser = mockUsers.find(
        (user) => user.email === userData.email
      );

      if (existingUser) {
        return false;
      }

      // Create new user with random ID (in a real app this would be done by backend)
      const newUser: User = {
        id: `user${Math.floor(Math.random() * 10000)}`,
        name: userData.name,
        email: userData.email,
        isArtist: userData.isArtist,
      };

      // In a real app, this would be saved to the database
      // For demo, we just set the current user
      setCurrentUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

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
