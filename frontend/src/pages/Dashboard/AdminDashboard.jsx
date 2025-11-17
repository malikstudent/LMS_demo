import React, { useState, useEffect } from 'react'
import Navbar from '../../components/ui/Navbar'
import Sidebar from '../../components/ui/Sidebar'
import { adminAPI, announcementAPI } from '../../services/api'
import UserManagement from './components/UserManagement'
import ClassManagement from './components/ClassManagement'
import AnnouncementManagement from './components/AnnouncementManagement'
import ReportsAnalytics from './components/ReportsAnalytics'

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalAssignments: 0,
    totalAnnouncements: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      // For now, use placeholder data. In production, these would come from API
      setStats({
        totalUsers: 25,
        totalClasses: 8,
        totalAssignments: 15,
        totalAnnouncements: 6,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = async (type) => {
    try {
      let response
      let filename
      
      switch (type) {
        case 'users':
          response = await adminAPI.exportUsers()
          filename = 'users_export.csv'
          break
        case 'classes':
          response = await adminAPI.exportClasses()
          filename = 'classes_export.csv'
          break
        case 'attendance':
          response = await adminAPI.exportAttendance()
          filename = 'attendance_export.csv'
          break
        case 'grades':
          response = await adminAPI.exportGrades()
          filename = 'grades_export.csv'
          break
      }
      
      if (response && response.data) {
        const blob = new Blob([response.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />
      case 'classes':
        return <ClassManagement />
      case 'announcements':
        return <AnnouncementManagement />
      case 'reports':
        return <ReportsAnalytics />
      default:
        return (
          <div>
            <h2>📊 Admin Dashboard Overview</h2>
            
            {loading ? (
              <div className="loading">Loading statistics...</div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="card stats-card">
                    <div className="stat-icon">👥</div>
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                    <span className="stat-label">Students, Teachers & Admins</span>
                  </div>

                  <div className="card stats-card">
                    <div className="stat-icon">📚</div>
                    <h3>Total Classes</h3>
                    <p className="stat-number">{stats.totalClasses}</p>
                    <span className="stat-label">Active Classes</span>
                  </div>

                  <div className="card stats-card">
                    <div className="stat-icon">📝</div>
                    <h3>Total Assignments</h3>
                    <p className="stat-number">{stats.totalAssignments}</p>
                    <span className="stat-label">Pending & Completed</span>
                  </div>

                  <div className="card stats-card">
                    <div className="stat-icon">📢</div>
                    <h3>Announcements</h3>
                    <p className="stat-number">{stats.totalAnnouncements}</p>
                    <span className="stat-label">Active Announcements</span>
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>🚀 Quick Actions</h3>
                  <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => setActiveTab('users')}>
                      👥 Manage Users
                    </button>
                    <button className="btn btn-success" onClick={() => setActiveTab('classes')}>
                      📚 Manage Classes
                    </button>
                    <button className="btn btn-info" onClick={() => setActiveTab('announcements')}>
                      📝 Manage Announcements
                    </button>
                    <button className="btn btn-warning" onClick={() => setActiveTab('reports')}>
                      📊 View Reports
                    </button>
                  </div>
                </div>

                <div className="export-section">
                  <h3>📈 Export Data</h3>
                  <div className="export-buttons">
                    <button className="btn btn-outline" onClick={() => exportToCSV('users')}>
                      📄 Export Users CSV
                    </button>
                    <button className="btn btn-outline" onClick={() => exportToCSV('classes')}>
                      📄 Export Classes CSV
                    </button>
                    <button className="btn btn-outline" onClick={() => exportToCSV('attendance')}>
                      📄 Export Attendance CSV
                    </button>
                    <button className="btn btn-outline" onClick={() => exportToCSV('grades')}>
                      📄 Export Grades CSV
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-layout">
          <Sidebar role={user.role} />
          <main className="dashboard-content">
            <div className="admin-tabs">
              <button 
                className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                � Dashboard
              </button>
              <button 
                className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 Users
              </button>
              <button 
                className={`tab ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => setActiveTab('classes')}
              >
                📚 Classes
              </button>
              <button 
                className={`tab ${activeTab === 'announcements' ? 'active' : ''}`}
                onClick={() => setActiveTab('announcements')}
              >
                📝 Announcements
              </button>
              <button 
                className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                � Reports
              </button>
            </div>

            <div className="tab-content">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .dashboard-content {
          padding: 20px;
        }

        .admin-tabs {
          display: flex;
          border-bottom: 2px solid #e9ecef;
          margin-bottom: 30px;
          gap: 5px;
        }

        .tab {
          background: none;
          border: none;
          padding: 12px 20px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          font-size: 14px;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
        }

        .tab:hover {
          color: #495057;
          background-color: #f8f9fa;
        }

        .tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background-color: #f8f9fa;
        }

        .tab-content {
          min-height: 400px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stats-card {
          text-align: center;
          padding: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          position: relative;
          overflow: hidden;
        }

        .stat-icon {
          font-size: 48px;
          margin-bottom: 10px;
          opacity: 0.8;
        }

        .stats-card h3 {
          margin: 10px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .stat-number {
          font-size: 36px;
          font-weight: bold;
          margin: 10px 0;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .quick-actions, .export-section {
          background-color: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .quick-actions h3, .export-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .action-buttons, .export-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background-color: #0056b3;
          transform: translateY(-2px);
        }

        .btn-success {
          background-color: #28a745;
          color: white;
        }

        .btn-success:hover {
          background-color: #1e7e34;
          transform: translateY(-2px);
        }

        .btn-info {
          background-color: #17a2b8;
          color: white;
        }

        .btn-info:hover {
          background-color: #117a8b;
          transform: translateY(-2px);
        }

        .btn-warning {
          background-color: #ffc107;
          color: #212529;
        }

        .btn-warning:hover {
          background-color: #e0a800;
          transform: translateY(-2px);
        }

        .btn-outline {
          background-color: transparent;
          color: #007bff;
          border: 2px solid #007bff;
        }

        .btn-outline:hover {
          background-color: #007bff;
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .action-buttons, .export-buttons {
            flex-direction: column;
          }
          
          .admin-tabs {
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>
    </>
  )
}

export default AdminDashboard
