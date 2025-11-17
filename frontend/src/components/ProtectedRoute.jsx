import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
