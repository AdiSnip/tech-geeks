"use client";

import { useContext, createContext, useState, useEffect, ReactNode } from "react";

export type User = {
  _id: string; // ✅ Added this line
  email: string;
  role: "entrepreneur" | "mentor" | "admin";
  name: string;
  location: string;
  profilePicture?: string;
  businessType: string;
  profileComplete: number;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState<User | null>(null);

  // 🧩 Load user from localStorage once
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user"); // corrupted data cleanup
      }
    }
  }, []);

  // 💾 Sync user with localStorage
  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(user);
  };

  // 🚪 Logout
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user: userState, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 🔹 Hook for easy access
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};
