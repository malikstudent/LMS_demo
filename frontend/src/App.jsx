import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import StudentDashboard from './pages/Dashboard/StudentDashboard'
import TeacherDashboard from './pages/Dashboard/TeacherDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import Attendance from './pages/Attendance'
import ProtectedRoute from './components/ProtectedRoute'
import useAuth from './services/useAuth'

function App() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="siswa" user={user}>
              <StudentDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guru"
          element={
            <ProtectedRoute requiredRole="guru" user={user}>
              <TeacherDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin" user={user}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute requiredRole="siswa" user={user}>
              <Attendance user={user} />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'guru' ? '/guru' : '/student'} /> : <Navigate to="/login" />} />
        <Route path="/unauthorized" element={<div style={{ padding: '20px', textAlign: 'center' }}><h2>Unauthorized Access</h2></div>} />
      </Routes>
    </div>
  )
}

export default App
