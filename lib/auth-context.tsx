"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api, tokenStorage, type ApiUser } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  bio?: string;
  trustScore: number;
  location?: string;
  yoe?: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toUser(raw: ApiUser): User {
  const initials = raw.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    initials,
    avatar: raw.avatar,
    bio: raw.bio,
    trustScore: raw.trustScore ?? 500,
    location: raw.location,
    yoe: raw.yoe,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) return;
    api.auth
      .me()
      .then((data) => {
        setUser(toUser(data.user));
        setIsLoggedIn(true);
      })
      .catch(() => {
        tokenStorage.remove();
      });
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    tokenStorage.set(data.token);
    setUser(toUser(data.user));
    setIsLoggedIn(true);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.auth.register({ name, email, password });
    tokenStorage.set(data.token);
    setUser(toUser(data.user));
    setIsLoggedIn(true);
  };

  const logout = () => {
    api.auth.logout().catch(() => {});
    tokenStorage.remove();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
