"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  name: string
  initials: string
  trustScore: number
  location: string
  yoe: number
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const login = () => {
    setIsLoggedIn(true)
    setUser({
      name: 'Arjun Kumar',
      initials: 'AK',
      trustScore: 780,
      location: 'Hyderabad',
      yoe: 3
    })
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
