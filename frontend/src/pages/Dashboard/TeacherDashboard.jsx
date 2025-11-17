import React from 'react'
import Navbar from '../../components/ui/Navbar'
import Sidebar from '../../components/ui/Sidebar'

const TeacherDashboard = ({ user }) => {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-layout">
          <Sidebar role={user.role} />
          <main className="dashboard-content">
            <h2>Teacher Dashboard</h2>
            <div className="card">
              <h3>Welcome, {user.name}!</h3>
              <p>You are logged in as a teacher (Guru).</p>
              <p>Features available:</p>
              <ul>
                <li>Create and manage assignments</li>
                <li>Grade student submissions</li>
                <li>View class performance analytics</li>
              </ul>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .dashboard-content {
          padding: 20px;
        }

        .dashboard-content h2 {
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .dashboard-content ul {
          margin: 10px 0;
          margin-left: 20px;
        }

        .dashboard-content li {
          margin: 5px 0;
        }
      `}</style>
    </>
  )
}

export default TeacherDashboard
