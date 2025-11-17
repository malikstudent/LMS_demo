import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import Sidebar from '../components/ui/Sidebar'
import { attendanceAPI } from '../services/api'

const Attendance = ({ user }) => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user's classes
    // In a real app, fetch from API
    setClasses([
      { id: 1, name: 'Kelas X A' },
      { id: 2, name: 'Kelas X B' },
      { id: 3, name: 'Kelas XI A' },
    ])
  }, [])

  const handleCheckin = async () => {
    if (!selectedClass) {
      setMessage('Please select a class')
      return
    }

    setLoading(true)
    try {
      const response = await attendanceAPI.checkin(selectedClass)
      setMessage(`Check-in successful at ${response.data.attendance.created_at}`)
      setTimeout(() => {
        setMessage('')
        navigate('/student')
      }, 2000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Check-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-layout">
          <Sidebar role={user.role} />
          <main className="dashboard-content">
            <h2>Attendance Check-in</h2>

            {message && (
              <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}

            <div className="card">
              <h3>Check In to Class</h3>
              <div className="form-group">
                <label>Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">-- Select a class --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-success"
                onClick={handleCheckin}
                disabled={loading || !selectedClass}
              >
                {loading ? 'Checking in...' : 'Check In'}
              </button>
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
      `}</style>
    </>
  )
}

export default Attendance
