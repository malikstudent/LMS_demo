import React, { useEffect, useState } from 'react'
import { authAPI } from '../services/api'

// Simple encryption helper (XOR with a key)
const encrypt = (str, key = 'LMS_SECURE_2025') => {
  return btoa(String.fromCharCode(...Array.from(str).map((char, i) => char.charCodeAt(0) ^ key.charCodeAt(i % key.length))))
}

const decrypt = (str, key = 'LMS_SECURE_2025') => {
  try {
    return Array.from(atob(str)).map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('')
  } catch (e) {
    return str
  }
}

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use sessionStorage instead of localStorage for better security
    const token = sessionStorage.getItem('auth_token')
    const userData = sessionStorage.getItem('user')

    if (token && userData) {
      try {
        const decryptedUser = decrypt(userData)
        setUser(JSON.parse(decryptedUser))
      } catch (e) {
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const { user, token } = response.data

      // Store token and encrypted user data in sessionStorage
      sessionStorage.setItem('auth_token', token)
      sessionStorage.setItem('user', encrypt(JSON.stringify(user)))
      setUser(user)

      return user
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('user')
      setUser(null)
      // Don't use navigate here - let components handle navigation
      window.location.href = '/login'
    }
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}

export default useAuth
