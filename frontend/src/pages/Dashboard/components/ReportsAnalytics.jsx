import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../../services/api'
import PerformanceChart from '../../../components/charts/PerformanceChart'

const ReportsAnalytics = () => {
  const [activeReport, setActiveReport] = useState('overview')
  const [reportData, setReportData] = useState({
    attendance: [],
    grades: [],
    overview: {}
  })
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  })
  const [selectedClass, setSelectedClass] = useState('')
  const [error, setError] = useState('')

  const reports = [
    { id: 'overview', name: '📊 Overview', icon: '📊' },
    { id: 'attendance', name: '👥 Attendance Report', icon: '👥' },
    { id: 'grades', name: '📝 Grade Report', icon: '📝' },
    { id: 'performance', name: '📈 Performance Analytics', icon: '📈' }
  ]

  useEffect(() => {
    loadReportData()
  }, [activeReport])

  const loadReportData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Mock data for demonstration
      const mockData = {
        overview: {
          totalStudents: 156,
          averageAttendance: 87.5,
          averageGrade: 82.3,
          totalAssignments: 45,
          completedAssignments: 38,
          pendingAssignments: 7
        },
        attendance: [
          { class: 'Class 10A', present: 22, absent: 3, rate: 88.0 },
          { class: 'Class 10B', present: 20, absent: 2, rate: 90.9 },
          { class: 'Class 11A', present: 24, absent: 1, rate: 96.0 },
          { class: 'Class 11B', present: 19, absent: 4, rate: 82.6 },
          { class: 'Class 12A', present: 26, absent: 2, rate: 92.9 }
        ],
        grades: [
          { subject: 'Mathematics', average: 85.2, highest: 98, lowest: 62 },
          { subject: 'English', average: 78.9, highest: 95, lowest: 58 },
          { subject: 'Science', average: 82.1, highest: 97, lowest: 65 },
          { subject: 'History', average: 79.8, highest: 94, lowest: 61 },
          { subject: 'Geography', average: 81.3, highest: 96, lowest: 59 }
        ],
        performance: {
          chartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Average Score',
              data: [75, 78, 80, 82, 85, 88],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
          }
        }
      }

      setReportData(mockData)
    } catch (error) {
      setError('Failed to load report data')
      console.error('Report error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (format) => {
    try {
      const filename = `${activeReport}_report_${new Date().toISOString().split('T')[0]}.${format}`
      
      if (format === 'csv') {
        let csvContent = ''
        
        switch (activeReport) {
          case 'attendance':
            csvContent = 'Class,Present,Absent,Rate\n'
            reportData.attendance.forEach(row => {
              csvContent += `${row.class},${row.present},${row.absent},${row.rate}%\n`
            })
            break
          case 'grades':
            csvContent = 'Subject,Average,Highest,Lowest\n'
            reportData.grades.forEach(row => {
              csvContent += `${row.subject},${row.average},${row.highest},${row.lowest}\n`
            })
            break
          default:
            csvContent = 'Report,Value\n'
            Object.entries(reportData.overview).forEach(([key, value]) => {
              csvContent += `${key},${value}\n`
            })
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
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
      setError('Export failed. Please try again.')
    }
  }

  const renderReportContent = () => {
    if (loading) return <div className="loading">Loading report data...</div>

    switch (activeReport) {
      case 'overview':
        return (
          <div className="overview-report">
            <h3>📊 System Overview</h3>
            <div className="overview-stats">
              <div className="stat-card">
                <h4>👥 Total Students</h4>
                <div className="stat-value">{reportData.overview.totalStudents}</div>
              </div>
              <div className="stat-card">
                <h4>📈 Average Attendance</h4>
                <div className="stat-value">{reportData.overview.averageAttendance}%</div>
              </div>
              <div className="stat-card">
                <h4>🎯 Average Grade</h4>
                <div className="stat-value">{reportData.overview.averageGrade}%</div>
              </div>
              <div className="stat-card">
                <h4>📝 Total Assignments</h4>
                <div className="stat-value">{reportData.overview.totalAssignments}</div>
              </div>
              <div className="stat-card">
                <h4>✅ Completed</h4>
                <div className="stat-value">{reportData.overview.completedAssignments}</div>
              </div>
              <div className="stat-card">
                <h4>⏳ Pending</h4>
                <div className="stat-value">{reportData.overview.pendingAssignments}</div>
              </div>
            </div>
          </div>
        )

      case 'attendance':
        return (
          <div className="attendance-report">
            <h3>👥 Attendance Report</h3>
            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.attendance.map((row, index) => (
                    <tr key={index}>
                      <td>{row.class}</td>
                      <td><span className="status-present">{row.present}</span></td>
                      <td><span className="status-absent">{row.absent}</span></td>
                      <td>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${row.rate}%` }}
                          ></div>
                          <span className="progress-text">{row.rate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'grades':
        return (
          <div className="grades-report">
            <h3>📝 Grade Report</h3>
            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Average Score</th>
                    <th>Highest Score</th>
                    <th>Lowest Score</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.grades.map((row, index) => (
                    <tr key={index}>
                      <td>{row.subject}</td>
                      <td><strong>{row.average}%</strong></td>
                      <td><span className="score-high">{row.highest}%</span></td>
                      <td><span className="score-low">{row.lowest}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'performance':
        return (
          <div className="performance-report">
            <h3>📈 Performance Analytics</h3>
            <div className="chart-container">
              <PerformanceChart data={reportData.performance?.chartData} />
            </div>
            <div className="performance-insights">
              <div className="insight-card">
                <h4>📈 Trending Up</h4>
                <p>Student performance has shown consistent improvement over the last 6 months with an average increase of 2.5% per month.</p>
              </div>
              <div className="insight-card">
                <h4>⭐ Top Performers</h4>
                <p>Mathematics and Science subjects show the highest average scores, indicating strong STEM performance.</p>
              </div>
              <div className="insight-card">
                <h4>🎯 Areas for Improvement</h4>
                <p>Language subjects could benefit from additional support programs to match STEM performance levels.</p>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Select a report to view</div>
    }
  }

  return (
    <div className="reports-analytics">
      <div className="header">
        <h2>📊 Reports & Analytics</h2>
        <div className="export-controls">
          <button className="btn btn-outline" onClick={() => exportReport('csv')}>
            📄 Export CSV
          </button>
          <button className="btn btn-outline" onClick={() => exportReport('pdf')}>
            📑 Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      <div className="reports-layout">
        <div className="report-sidebar">
          {reports.map(report => (
            <button
              key={report.id}
              className={`report-tab ${activeReport === report.id ? 'active' : ''}`}
              onClick={() => setActiveReport(report.id)}
            >
              <span className="tab-icon">{report.icon}</span>
              <span className="tab-name">{report.name}</span>
            </button>
          ))}
        </div>

        <div className="report-content">
          {renderReportContent()}
        </div>
      </div>

      <style>{`
        .reports-analytics {
          max-width: 1400px;
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

        .export-controls {
          display: flex;
          gap: 10px;
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

        .reports-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 30px;
          min-height: 500px;
        }

        .report-sidebar {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 10px;
          height: fit-content;
        }

        .report-tab {
          width: 100%;
          background: none;
          border: none;
          padding: 15px;
          text-align: left;
          cursor: pointer;
          border-radius: 6px;
          margin-bottom: 5px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .report-tab:hover {
          background-color: #f8f9fa;
        }

        .report-tab.active {
          background-color: #e3f2fd;
          color: #1976d2;
          font-weight: 500;
        }

        .tab-icon {
          font-size: 16px;
        }

        .tab-name {
          font-size: 14px;
        }

        .report-content {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 30px;
          min-height: 500px;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #6c757d;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .stat-card h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
        }

        .report-table {
          margin-top: 20px;
          overflow-x: auto;
        }

        .report-table table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .report-table th,
        .report-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .report-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .report-table tr:hover {
          background-color: #f8f9fa;
        }

        .status-present {
          background-color: #d4edda;
          color: #155724;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-absent {
          background-color: #f8d7da;
          color: #721c24;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .score-high {
          color: #28a745;
          font-weight: 600;
        }

        .score-low {
          color: #dc3545;
          font-weight: 600;
        }

        .progress-bar {
          position: relative;
          background-color: #e9ecef;
          border-radius: 10px;
          height: 20px;
          min-width: 100px;
        }

        .progress-fill {
          background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 11px;
          font-weight: 500;
          color: #495057;
        }

        .chart-container {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .performance-insights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .insight-card {
          background: #f8f9fa;
          border-left: 4px solid #007bff;
          padding: 20px;
          border-radius: 0 8px 8px 0;
        }

        .insight-card h4 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .insight-card p {
          color: #6c757d;
          margin: 0;
          line-height: 1.5;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .btn-outline {
          background-color: transparent;
          color: #007bff;
          border: 2px solid #007bff;
        }

        .btn-outline:hover {
          background-color: #007bff;
          color: white;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .reports-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .export-controls {
            justify-content: center;
          }

          .overview-stats {
            grid-template-columns: 1fr;
          }

          .performance-insights {
            grid-template-columns: 1fr;
          }

          .report-sidebar {
            order: 2;
          }

          .report-content {
            order: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default ReportsAnalytics