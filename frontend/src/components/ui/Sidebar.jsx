import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ role }) => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const studentLinks = [
    { path: '/student', label: '📊 Dashboard', role: 'siswa' },
    { path: '/attendance', label: '✓ Attendance', role: 'siswa' },
    { path: '/assignments', label: '📝 Assignments', role: 'siswa' },
    { path: '/announcements', label: '📢 Announcements', role: 'siswa' },
  ]

  const teacherLinks = [
    { path: '/guru', label: '📊 Dashboard', role: 'guru' },
    { path: '/guru/assignments', label: '📝 My Assignments', role: 'guru' },
  ]

  const adminLinks = [
    { path: '/admin', label: '🔧 Dashboard', role: 'admin' },
    { path: '/admin/users', label: '👥 Manage Users', role: 'admin' },
    { path: '/admin/reports', label: '📈 Reports', role: 'admin' },
  ]

  let links = []
  if (role === 'siswa') links = studentLinks
  else if (role === 'guru') links = teacherLinks
  else if (role === 'admin') links = adminLinks

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`sidebar-link ${isActive(link.path)}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <style>{`
        .sidebar {
          background-color: #34495e;
          color: white;
          padding: 20px;
          border-radius: 8px;
          height: fit-content;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sidebar-link {
          padding: 10px 15px;
          border-radius: 4px;
          transition: background-color 0.3s;
          display: block;
        }

        .sidebar-link:hover {
          background-color: #2c3e50;
        }

        .sidebar-link.active {
          background-color: #007bff;
          font-weight: 600;
        }
      `}</style>
    </aside>
  )
}

export default Sidebar
