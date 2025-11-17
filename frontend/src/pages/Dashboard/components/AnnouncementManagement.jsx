import React, { useState, useEffect } from 'react'
import { announcementAPI } from '../../../services/api'

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await announcementAPI.list()
      setAnnouncements(response.data)
    } catch (error) {
      console.error('Error loading announcements:', error)
      // Use mock data for now
      setAnnouncements([
        {
          id: 1,
          title: 'Welcome to New Academic Year',
          content: 'We are excited to welcome all students to the new academic year 2025. Classes will begin on January 15th.',
          priority: 'high',
          created_at: '2024-11-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Library Hours Update',
          content: 'The library will now be open from 8 AM to 8 PM on weekdays and 9 AM to 5 PM on weekends.',
          priority: 'normal',
          created_at: '2024-11-14T14:30:00Z'
        },
        {
          id: 3,
          title: 'Sports Day Registration',
          content: 'Registration for the annual sports day is now open. Please contact your class teacher for more details.',
          priority: 'low',
          created_at: '2024-11-13T09:15:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      if (editingAnnouncement) {
        await announcementAPI.update(editingAnnouncement.id, formData)
      } else {
        await announcementAPI.create(formData)
      }
      
      setShowModal(false)
      setEditingAnnouncement(null)
      setFormData({ title: '', content: '', priority: 'normal' })
      loadAnnouncements()
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority
    })
    setShowModal(true)
  }

  const handleDelete = async (announcementId) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    
    try {
      await announcementAPI.delete(announcementId)
      loadAnnouncements()
    } catch (error) {
      setError(error.response?.data?.message || 'Delete failed')
      // For demo purposes, remove from local state
      setAnnouncements(prev => prev.filter(a => a.id !== announcementId))
    }
  }

  const openCreateModal = () => {
    setEditingAnnouncement(null)
    setFormData({ title: '', content: '', priority: 'normal' })
    setShowModal(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545'
      case 'normal': return '#28a745'
      case 'low': return '#ffc107'
      default: return '#6c757d'
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority'
      case 'normal': return 'Normal'
      case 'low': return 'Low Priority'
      default: return priority
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <div className="announcement-management">
      <div className="header">
        <h2>📝 Announcement Management</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          ➕ Create Announcement
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading announcements...</div>
      ) : (
        <div className="announcements-grid">
          {announcements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="card-header">
                <h3>{announcement.title}</h3>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(announcement.priority) }}
                >
                  {getPriorityLabel(announcement.priority)}
                </span>
              </div>
              
              <div className="card-content">
                <p>{announcement.content}</p>
              </div>
              
              <div className="card-footer">
                <div className="date-info">
                  📅 {formatDate(announcement.created_at)}
                </div>
                <div className="card-actions">
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(announcement)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {announcements.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📢</div>
              <h3>No Announcements Yet</h3>
              <p>Create your first announcement to get started.</p>
              <button className="btn btn-primary" onClick={openCreateModal}>
                ➕ Create First Announcement
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Enter announcement content"
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  required
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .announcement-management {
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

        .announcements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .announcement-card {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
          overflow: hidden;
        }

        .announcement-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-header {
          padding: 20px 20px 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .card-header h3 {
          color: #2c3e50;
          margin: 0;
          line-height: 1.3;
          flex: 1;
        }

        .priority-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }

        .card-content {
          padding: 15px 20px;
        }

        .card-content p {
          color: #6c757d;
          margin: 0;
          line-height: 1.5;
        }

        .card-footer {
          padding: 0 20px 20px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .date-info {
          font-size: 12px;
          color: #6c757d;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          color: #495057;
          margin: 0 0 10px 0;
        }

        .empty-state p {
          margin: 0 0 30px 0;
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
          transition: all 0.2s ease;
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
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
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
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
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
          .announcements-grid {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
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

export default AnnouncementManagement