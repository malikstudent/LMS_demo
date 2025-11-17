import React, { useEffect, useState } from 'react'
import Navbar from '../../components/ui/Navbar'
import Sidebar from '../../components/ui/Sidebar'
import PerformanceChart from '../../components/charts/PerformanceChart'
import { attendanceAPI, analyticsAPI } from '../../services/api'

const StudentDashboard = ({ user }) => {
  const [attendance, setAttendance] = useState(null)
  const [scores, setScores] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, scoresRes] = await Promise.all([
          attendanceAPI.getMyAttendance(),
          analyticsAPI.getStudentScores(user.id),
        ])

        setAttendance(attendanceRes.data)
        setScores(scoresRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.id])

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-layout">
          <Sidebar role={user.role} />
          <main className="dashboard-content">
            <h2>Welcome, {user.name}!</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div className="card stats-card">
                <h3>Attendance Rate</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                  {attendance?.stats?.attendance_rate}%
                </p>
                <small>{attendance?.stats?.present} of {attendance?.stats?.total} present</small>
              </div>

              <div className="card stats-card">
                <h3>Average Score</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                  {scores?.average_score || 'N/A'}
                </p>
                <small>Based on submissions</small>
              </div>

              <div className="card stats-card">
                <h3>Student ID</h3>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#6c757d' }}>
                  {user.student_id}
                </p>
              </div>
            </div>

            {attendance && (
              <div className="card">
                <h3>Attendance Overview</h3>
                <PerformanceChart
                  type="bar"
                  data={[attendance.stats.present, attendance.stats.absent, attendance.stats.late]}
                  labels={['Present', 'Absent', 'Late']}
                  title="Attendance Statistics"
                />
              </div>
            )}

            {scores && scores.scores.length > 0 && (
              <div className="card">
                <h3>Score History</h3>
                <PerformanceChart
                  type="line"
                  data={scores.scores.map(s => s.score || 0)}
                  labels={scores.scores.map(s => s.assignment)}
                  title="Your Scores"
                />
              </div>
            )}

            <div className="card">
              <h3>Recent Attendance</h3>
              {attendance?.attendances?.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.attendances.slice(0, 5).map((att) => (
                      <tr key={att.id}>
                        <td>{att.date}</td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: att.status === 'present' ? '#d4edda' : '#f8d7da',
                            color: att.status === 'present' ? '#155724' : '#721c24',
                          }}>
                            {att.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No attendance records yet.</p>
              )}
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

        .stats-card {
          text-align: center;
        }

        .stats-card h3 {
          margin-bottom: 10px;
          color: #555;
        }

        .stats-card small {
          color: #999;
        }
      `}</style>
    </>
  )
}

export default StudentDashboard
