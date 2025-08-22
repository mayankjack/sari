'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios, { AxiosError } from 'axios'

// Set default axios base URL
axios.defaults.baseURL = 'http://localhost:5000'

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'customer'
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<void>
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize axios with base URL
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message 
        ? error.response.data.message 
        : 'Login failed'
      throw new Error(errorMessage)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { token: newToken, user: newUser } = response.data
      
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message 
        ? error.response.data.message 
        : 'Registration failed'
      throw new Error(errorMessage)
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData)
      setUser(response.data.user)
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message 
        ? error.response.data.message 
        : 'Profile update failed'
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const isAdmin = user?.role === 'admin'

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    updateProfile,
    logout,
    loading,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
