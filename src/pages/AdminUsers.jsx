import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminUsers.css';
import '../styles/AdminSidebar.css';

const initialStudents = [
  { id: 1, name: 'James Mwangi',  email: 'james.mwangi@university.ac.ke',  joined: '12 Jan 2026', sessions: 5, status: 'active'   },
  { id: 2, name: 'Sara Mutua',    email: 'sara.mutua@university.ac.ke',    joined: '3 Feb 2026',  sessions: 2, status: 'active'   },
  { id: 3, name: 'Aisha Omar',    email: 'aisha.omar@university.ac.ke',    joined: '20 Feb 2026', sessions: 8, status: 'active'   },
  { id: 4, name: 'Tom Kipchoge',  email: 'tom.kipchoge@university.ac.ke',  joined: '15 Mar 2026', sessions: 1, status: 'disabled' },
  { id: 5, name: 'Lily Wanjiru',  email: 'lily.wanjiru@university.ac.ke',  joined: '2 Apr 2026',  sessions: 3, status: 'active'   },
];

const initialCounsellors = [
  { id: 1, name: 'Dr. Amina Kariuki', email: 'amina.kariuki@clinic.ac.ke', specialisation: 'Anxiety & Stress',     sessions: 84, rating: 4.8, status: 'active'  },
  { id: 2, name: 'Dr. James Omondi',  email: 'james.omondi@clinic.ac.ke',  specialisation: 'Depression & Recovery',sessions: 62, rating: 4.6, status: 'active'  },
  { id: 3, name: 'Dr. Fatuma Hassan', email: 'fatuma.hassan@clinic.ac.ke', specialisation: 'Trauma & Grief',       sessions: 97, rating: 4.9, status: 'pending' },
  { id: 4, name: 'Dr. Peter Mwangi',  email: 'peter.mwangi@clinic.ac.ke',  specialisation: 'CBT & Mindfulness',    sessions: 73, rating: 4.7, status: 'active'  },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState(initialStudents);
  const [counsellors, setCounsellors] = useState(initialCounsellors);
  const [search, setSearch] = useState('');

  const toggleStudentStatus = (id) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === 'active' ? 'disabled' : 'active' } : s));
  };

  const toggleCounsellorStatus = (id, newStatus) => {
    setCounsellors((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCounsellors = counsellors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
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
                      <tr key={s.id}>
                        <td>
                          <div className="au-name-cell">
                            <div className="au-avatar student">{s.name.split(' ').map(n => n[0]).join('')}</div>
                            {s.name}
                          </div>
                        </td>
                        <td className="au-email-cell">{s.email}</td>
                        <td>{s.joined}</td>
                        <td>{s.sessions}</td>
                        <td>
                          <span className={`au-status-badge ${s.status}`}>
                            {s.status === 'active' ? '✅ Active' : '🚫 Disabled'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`au-toggle-btn ${s.status === 'active' ? 'disable' : 'enable'}`}
                            onClick={() => toggleStudentStatus(s.id)}
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
                      <tr key={c.id}>
                        <td>
                          <div className="au-name-cell">
                            <div className="au-avatar counsellor">{c.name.split(' ').map(n => n[0]).join('').replace('Dr', '')}</div>
                            <div>
                              <div>{c.name}</div>
                              <div className="au-email-cell" style={{ fontSize: '11px' }}>{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{c.specialisation}</td>
                        <td>{c.sessions}</td>
                        <td>⭐ {c.rating}</td>
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
                              <button className="au-toggle-btn enable" onClick={() => toggleCounsellorStatus(c.id, 'active')}>Approve</button>
                            )}
                            {c.status === 'active' && (
                              <button className="au-toggle-btn disable" onClick={() => toggleCounsellorStatus(c.id, 'disabled')}>Disable</button>
                            )}
                            {c.status === 'disabled' && (
                              <button className="au-toggle-btn enable" onClick={() => toggleCounsellorStatus(c.id, 'active')}>Enable</button>
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