import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../services/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin')
      } else if (user.role === 'guru') {
        navigate('/guru')
      } else if (user.role === 'siswa') {
        navigate('/student')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>📚 LMS System</h1>
        <p>Learning Management System</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="login-info">
          <p><strong>🔐 Secure LMS System</strong></p>
          <p>Contact administrator for access credentials</p>
          <div className="security-notice">
            <small>🛡️ This system is protected by advanced security measures</small>
          </div>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-box {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 400px;
        }

        .login-box h1 {
          text-align: center;
          color: #333;
          margin-bottom: 5px;
        }

        .login-box p {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
        }

        .login-info {
          margin-top: 20px;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 4px;
          font-size: 12px;
          text-align: center;
        }

        .login-info p {
          margin: 5px 0;
        }

        .security-notice {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.3);
        }

        .security-notice small {
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}

export default Login
