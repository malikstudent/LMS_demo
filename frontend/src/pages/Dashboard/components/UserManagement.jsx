import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../../services/api'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'siswa'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.listUsers()
      setUsers(response.data)
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      if (editingUser) {
        await adminAPI.updateUser(editingUser.id, formData)
      } else {
        await adminAPI.createUser(formData)
      }
      
      setShowModal(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'siswa' })
      loadUsers()
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setShowModal(true)
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      await adminAPI.deleteUser(userId)
      loadUsers()
    } catch (error) {
      setError(error.response?.data?.message || 'Delete failed')
    }
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'siswa' })
    setShowModal(true)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545'
      case 'guru': return '#28a745'
      case 'siswa': return '#007bff'
      default: return '#6c757d'
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'guru': return 'Teacher'
      case 'siswa': return 'Student'
      default: return role
    }
  }

  return (
    <div className="user-management">
      <div className="header">
        <h2>👥 User Management</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          ➕ Add New User
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Student ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span 
                      className="role-badge"
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>{user.student_id || '-'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(user)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUser ? 'Edit User' : 'Create New User'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!editingUser}
                    placeholder={editingUser ? "Leave empty to keep current password" : ""}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="siswa">Student</option>
                  <option value="guru">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .user-management {
          max-width: 1200px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header h2 {
          color: #2c3e50;
          margin: 0;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }

        .alert {
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .alert-error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .users-table {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        tr:hover {
          background-color: #f8f9fa;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }

        .btn {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          margin-right: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 11px;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          width: 90%;
          max-width: 500px;
        }

        .modal h3 {
          margin-top: 0;
          color: #2c3e50;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #495057;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .form-actions .btn {
          margin-right: 0;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .users-table {
            overflow-x: auto;
          }

          table {
            min-width: 600px;
          }

          .modal {
            margin: 20px;
            width: calc(100% - 40px);
          }
        }
      `}</style>
    </div>
  )
}

export default UserManagement