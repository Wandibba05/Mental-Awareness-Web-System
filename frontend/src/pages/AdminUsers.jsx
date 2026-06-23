import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { getAllStudentsAdmin, updateStudentStatus, getAllCounsellorsAdmin, updateCounsellorStatus } from '../api';
import '../styles/AdminUsers.css';
import '../styles/AdminSidebar.css';



const AdminUsers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [studentsData, counsellorsData] = await Promise.all([
          getAllStudentsAdmin(),
          getAllCounsellorsAdmin(),
        ]);
        setStudents(studentsData);
        setCounsellors(counsellorsData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleStudentStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    try {
      const updated = await updateStudentStatus(id, newStatus);
      setStudents((prev) => prev.map((s) => (s._id === id ? updated : s)));
    } catch (error) {
      alert('Failed to update student status.');
      console.error(error);
    }
  };

  const toggleCounsellorStatus = async (id, newStatus) => {
    try {
      const updated = await updateCounsellorStatus(id, newStatus);
      setCounsellors((prev) => prev.map((c) => (c._id === id ? updated : c)));
    } catch (error) {
      alert('Failed to update counsellor status.');
      console.error(error);
    }
  };

  const filteredStudents = students.filter((s) =>
  s.fullName.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
);

const filteredCounsellors = counsellors.filter((c) =>
  c.fullName.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="au-page">

          {/* Topbar */}
          <div className="au-topbar">
            <div>
              <h1 className="au-title">Manage users</h1>
              <p className="au-sub">{students.length} students · {counsellors.length} counsellors</p>
            </div>
            <button className="au-back-btn" onClick={() => navigate('/admin/dashboard')}>
              Back to dashboard
            </button>
          </div>

          {/* Tabs */}
          <div className="au-tabs">
            <button className={`au-tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
              🎓 Students ({students.length})
            </button>
            <button className={`au-tab ${activeTab === 'counsellors' ? 'active' : ''}`} onClick={() => setActiveTab('counsellors')}>
              🩺 Counsellors ({counsellors.length})
            </button>
          </div>

          <div className="au-content">

            {/* Search + add */}
            <div className="au-toolbar">
              <div className="au-search-bar">
                <span>🔍</span>
                <input
                  className="au-search-input"
                  placeholder={`Search ${activeTab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {activeTab === 'counsellors' && (
                <button className="au-add-btn">➕ Add counsellor</button>
              )}
            </div>

            {/* Students table */}
            {activeTab === 'students' && (
              <div className="au-table-card">
                <table className="au-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Sessions</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
  <tr key={s._id}>
    <td>
      <div className="au-name-cell">
        <div className="au-avatar student">{s.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2)}</div>
        {s.fullName}
      </div>
    </td>
    <td className="au-email-cell">{s.email}</td>
    <td>{new Date(s.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
    <td>—</td>
    <td>
      <span className={`au-status-badge ${s.status}`}>
        {s.status === 'active' ? '✅ Active' : '🚫 Disabled'}
      </span>
    </td>
    <td>
      <button
        className={`au-toggle-btn ${s.status === 'active' ? 'disable' : 'enable'}`}
        onClick={() => toggleStudentStatus(s._id, s.status)}
      >
        {s.status === 'active' ? 'Disable' : 'Enable'}
      </button>
    </td>
  </tr>
))}
                  </tbody>
                </table>
                {filteredStudents.length === 0 && (
                  <div className="au-empty">No students found for "{search}"</div>
                )}
              </div>
            )}

            {/* Counsellors table */}
            {activeTab === 'counsellors' && (
              <div className="au-table-card">
                <table className="au-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialisation</th>
                      <th>Sessions</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCounsellors.map((c) => (
  <tr key={c._id}>
    <td>
      <div className="au-name-cell">
        <div className="au-avatar counsellor">{c.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2)}</div>
        <div>
          <div>{c.fullName}</div>
          <div className="au-email-cell" style={{ fontSize: '11px' }}>{c.email}</div>
        </div>
      </div>
    </td>
    <td>{c.specialisation || 'General counselling'}</td>
    <td>—</td>
    <td>—</td>
    <td>
      <span className={`au-status-badge ${c.status}`}>
        {c.status === 'active' && '✅ Active'}
        {c.status === 'pending' && '⏳ Pending'}
        {c.status === 'disabled' && '🚫 Disabled'}
      </span>
    </td>
    <td>
      <div className="au-action-group">
        {c.status === 'pending' && (
          <button className="au-toggle-btn enable" onClick={() => toggleCounsellorStatus(c._id, 'active')}>Approve</button>
        )}
        {c.status === 'active' && (
          <button className="au-toggle-btn disable" onClick={() => toggleCounsellorStatus(c._id, 'disabled')}>Disable</button>
        )}
        {c.status === 'disabled' && (
          <button className="au-toggle-btn enable" onClick={() => toggleCounsellorStatus(c._id, 'active')}>Enable</button>
        )}
      </div>
    </td>
  </tr>
))}
                  </tbody>
                </table>
                {filteredCounsellors.length === 0 && (
                  <div className="au-empty">No counsellors found for "{search}"</div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;