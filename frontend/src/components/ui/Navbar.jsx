import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../services/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-container container">
        <div className="nav-brand">
          <h1>📚 LMS System</h1>
        </div>
        <div className="nav-menu">
          {user && (
            <>
              <span className="nav-user">
                {user.name} ({user.role})
              </span>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`
        .navbar {
          background-color: #2c3e50;
          color: white;
          padding: 15px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand h1 {
          font-size: 24px;
          margin: 0;
        }

        .nav-menu {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-user {
          font-size: 14px;
          color: #bdc3c7;
        }
      `}</style>
    </nav>
  )
}

export default Navbar
