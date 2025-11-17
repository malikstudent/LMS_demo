import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../../services/api'

const ClassManagement = () => {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showClassModal, setShowClassModal] = useState(false)
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [editingSubject, setEditingSubject] = useState(null)
  const [classFormData, setClassFormData] = useState({
    name: '',
    description: ''
  })
  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('classes')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // For now using mock data - in production these would come from API
      setClasses([
        { id: 1, name: 'Class 10A', description: 'Mathematics and Science focus', student_count: 25 },
        { id: 2, name: 'Class 11B', description: 'Literature and Arts focus', student_count: 22 },
        { id: 3, name: 'Class 12C', description: 'Final year preparation', student_count: 28 }
      ])
      setSubjects([
        { id: 1, name: 'Mathematics', code: 'MATH101', description: 'Basic Mathematics' },
        { id: 2, name: 'English', code: 'ENG101', description: 'English Language and Literature' },
        { id: 3, name: 'Science', code: 'SCI101', description: 'General Science' }
      ])
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleClassSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      if (editingClass) {
        // await adminAPI.updateClass(editingClass.id, classFormData)
        console.log('Update class:', editingClass.id, classFormData)
      } else {
        // await adminAPI.createClass(classFormData)
        console.log('Create class:', classFormData)
      }
      
      setShowClassModal(false)
      setEditingClass(null)
      setClassFormData({ name: '', description: '' })
      loadData()
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleSubjectSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      if (editingSubject) {
        // await adminAPI.updateSubject(editingSubject.id, subjectFormData)
        console.log('Update subject:', editingSubject.id, subjectFormData)
      } else {
        // await adminAPI.createSubject(subjectFormData)
        console.log('Create subject:', subjectFormData)
      }
      
      setShowSubjectModal(false)
      setEditingSubject(null)
      setSubjectFormData({ name: '', code: '', description: '' })
      loadData()
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleClassEdit = (classItem) => {
    setEditingClass(classItem)
    setClassFormData({
      name: classItem.name,
      description: classItem.description
    })
    setShowClassModal(true)
  }

  const handleSubjectEdit = (subject) => {
    setEditingSubject(subject)
    setSubjectFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description
    })
    setShowSubjectModal(true)
  }

  const handleClassDelete = async (classId) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    
    try {
      // await adminAPI.deleteClass(classId)
      console.log('Delete class:', classId)
      loadData()
    } catch (error) {
      setError(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleSubjectDelete = async (subjectId) => {
    if (!confirm('Are you sure you want to delete this subject?')) return
    
    try {
      // await adminAPI.deleteSubject(subjectId)
      console.log('Delete subject:', subjectId)
      loadData()
    } catch (error) {
      setError(error.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="class-management">
      <h2>📚 Class & Subject Management</h2>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          🏫 Classes
        </button>
        <button 
          className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          📖 Subjects
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <div className="tab-content">
          {activeTab === 'classes' ? (
            <div className="classes-section">
              <div className="section-header">
                <h3>🏫 Classes</h3>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setEditingClass(null)
                    setClassFormData({ name: '', description: '' })
                    setShowClassModal(true)
                  }}
                >
                  ➕ Add New Class
                </button>
              </div>

              <div className="classes-grid">
                {classes.map(classItem => (
                  <div key={classItem.id} className="class-card">
                    <h4>{classItem.name}</h4>
                    <p>{classItem.description}</p>
                    <div className="student-count">
                      👥 {classItem.student_count} students
                    </div>
                    <div className="card-actions">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleClassEdit(classItem)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleClassDelete(classItem.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="subjects-section">
              <div className="section-header">
                <h3>📖 Subjects</h3>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setEditingSubject(null)
                    setSubjectFormData({ name: '', code: '', description: '' })
                    setShowSubjectModal(true)
                  }}
                >
                  ➕ Add New Subject
                </button>
              </div>

              <div className="subjects-table">
                <table>
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map(subject => (
                      <tr key={subject.id}>
                        <td><code>{subject.code}</code></td>
                        <td>{subject.name}</td>
                        <td>{subject.description}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleSubjectEdit(subject)}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleSubjectDelete(subject.id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Class Modal */}
      {showClassModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingClass ? 'Edit Class' : 'Create New Class'}</h3>
            
            <form onSubmit={handleClassSubmit}>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  value={classFormData.name}
                  onChange={(e) => setClassFormData({...classFormData, name: e.target.value})}
                  placeholder="e.g., Class 10A, Grade 12 Science"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={classFormData.description}
                  onChange={(e) => setClassFormData({...classFormData, description: e.target.value})}
                  placeholder="Brief description of the class focus or specialization"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowClassModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingSubject ? 'Edit Subject' : 'Create New Subject'}</h3>
            
            <form onSubmit={handleSubjectSubmit}>
              <div className="form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  value={subjectFormData.code}
                  onChange={(e) => setSubjectFormData({...subjectFormData, code: e.target.value})}
                  placeholder="e.g., MATH101, ENG202"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={subjectFormData.name}
                  onChange={(e) => setSubjectFormData({...subjectFormData, name: e.target.value})}
                  placeholder="e.g., Mathematics, English Literature"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={subjectFormData.description}
                  onChange={(e) => setSubjectFormData({...subjectFormData, description: e.target.value})}
                  placeholder="Brief description of the subject content"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSubjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSubject ? 'Update Subject' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .class-management {
          max-width: 1200px;
        }

        .class-management h2 {
          color: #2c3e50;
          margin-bottom: 30px;
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

        .tabs {
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

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          color: #495057;
          margin: 0;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }

        .classes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .class-card {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .class-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .class-card h4 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .class-card p {
          color: #6c757d;
          margin: 0 0 15px 0;
          line-height: 1.5;
        }

        .student-count {
          background-color: #e3f2fd;
          color: #1976d2;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          display: inline-block;
          margin-bottom: 15px;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .subjects-table {
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

        code {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 3px;
          padding: 2px 6px;
          font-size: 12px;
          color: #e83e8c;
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
          .classes-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .subjects-table {
            overflow-x: auto;
          }

          table {
            min-width: 600px;
          }

          .modal {
            margin: 20px;
            width: calc(100% - 40px);
          }

          .tabs {
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  )
}

export default ClassManagement