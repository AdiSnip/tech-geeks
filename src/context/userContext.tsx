"use client";

import { useContext, createContext, useState, useEffect, ReactNode } from "react";

// ---------- Shared Location Type ----------
type Location = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

// ---------- Entrepreneur Type ----------
export type Entrepreneur = {
  _id: string;
  email: string;
  role: "entrepreneur" | "admin";
  name: string;
  location: Location;
  profilePicture?: string;
  businessType?: string;
  companyName?: string;
  companyDescription?: string;
  website?: string;
  industry?: string;
  profileComplete: number;
  createdAt: string;
  updatedAt: string;
};

// ---------- Regular User Type ----------
export type RegularUser = {
  _id: string;
  email: string;
  role: "user";
  name: string;
  location: Location;
  profilePicture?: string;
  orderHistory?: { orderId: string }[];
  createdAt: string;
  updatedAt: string;
};

// ---------- Combined User Type ----------
export type AppUser = Entrepreneur | RegularUser;

// ---------- Context Type ----------
type UserContextType = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
};

// ---------- Create Context ----------
const UserContext = createContext<UserContextType | undefined>(undefined);

// ---------- Provider ----------
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState<AppUser | null>(null);

  // Load user once from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Sync user to localStorage
  const setUser = (user: AppUser | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(user);
  };

  // Logout
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user: userState, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// ---------- Hook ----------
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};
