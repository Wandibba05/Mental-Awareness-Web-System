import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getApprovedJournals, createJournal } from '../api';
import '../styles/Resources.css';
import '../styles/Sidebar.css';

const resources = [
  { id: 1, icon: '🧘', title: 'Breathing exercises',  desc: 'Guided techniques to calm anxiety in minutes',      badge: 'Interactive', badgeColor: '#dbeafe', badgeText: '#1d4ed8' },
  { id: 2, icon: '📋', title: 'Self-assessment quiz', desc: 'Check your mental wellness with a PHQ-9 quiz',       badge: 'Quiz',        badgeColor: '#d1fae5', badgeText: '#065f46' },
  { id: 3, icon: '🎧', title: 'Mindfulness audio',    desc: 'Calming guided meditations and sleep sounds',        badge: 'Audio',       badgeColor: '#fef3c7', badgeText: '#92400e' },
  { id: 4, icon: '📚', title: 'Recommended reads',    desc: 'Books and articles curated by our counsellors',      badge: 'Reading',     badgeColor: '#f3e8ff', badgeText: '#6b21a8' },
  { id: 5, icon: '🌐', title: 'External helplines',   desc: 'Kenya and international mental health crisis lines', badge: 'Emergency',   badgeColor: '#fee2e2', badgeText: '#991b1b' },
];

const categories = ['All', 'Anxiety', 'Depression', 'Recovery', 'Counselling'];

const categoryColors = {
  Anxiety:     { color: '#dbeafe', text: '#1d4ed8' },
  Depression:  { color: '#d1fae5', text: '#065f46' },
  Recovery:    { color: '#fef3c7', text: '#92400e' },
  Stress:      { color: '#fee2e2', text: '#991b1b' },
  Grief:       { color: '#f3e8ff', text: '#6b21a8' },
  Counselling: { color: '#e0e7ff', text: '#3730a3' },
};

const Resources = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]         = useState('journals');
  const [activeCategory, setActiveCategory] = useState('All');
  const [journals, setJournals]           = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [storyTitle, setStoryTitle]       = useState('');
  const [storyCategory, setStoryCategory] = useState('Anxiety');
  const [storyText, setStoryText]         = useState('');
  const [rating, setRating]               = useState(0);
  const [isAnonymous, setIsAnonymous]     = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [search, setSearch]               = useState('');
  const [expandedJournal, setExpandedJournal] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await getApprovedJournals();
        setJournals(data);
      } catch (error) {
        console.error('Failed to fetch journals:', error);
      } finally {
        setLoadingJournals(false);
      }
    };
    fetchJournals();
  }, []);

  const filteredJournals = journals.filter((j) => {
    const matchesCategory = activeCategory === 'All' || j.category === activeCategory;
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.storyText.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async () => {
    if (!storyText || !storyTitle) {
      alert('Please add a title and write your story before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await createJournal({
        title: storyTitle,
        category: storyCategory,
        storyText,
        rating: rating || null,
        isAnonymous,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setStoryTitle('');
      setStoryText('');
      setRating(0);
    } catch (error) {
      alert('Something went wrong while submitting your story. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="res-page">

          {/* Top bar */}
          <div className="res-topbar">
            <div>
              <h1 className="res-title">Resources</h1>
              <p className="res-sub">Stories, tools and support for your mental health journey</p>
            </div>
            <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
              Back to dashboard
            </button>
          </div>

          {/* Tabs */}
          <div className="res-tabs">
            {['journals', 'share', 'tools'].map((tab) => (
              <button
                key={tab}
                className={`res-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'journals' && '📖 Journals'}
                {tab === 'share'    && '✍️ Share your story'}
                {tab === 'tools'    && '🛠️ Mental health tools'}
              </button>
            ))}
          </div>

          <div className="res-content">

            {/* ── JOURNALS TAB ── */}
            {activeTab === 'journals' && (
              <div>
                {/* Search */}
                <div className="search-bar">
                  <span>🔍</span>
                  <input
                    className="search-input"
                    placeholder="Search stories and articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Category filter */}
                <div className="category-row">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Journal cards */}
                {loadingJournals ? (
                  <div className="empty-state">
                    <div style={{ fontSize: '40px' }}>⏳</div>
                    <p>Loading stories...</p>
                  </div>
                ) : filteredJournals.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: '40px' }}>📭</div>
                    <p>
                      {journals.length === 0
                        ? 'No stories have been published yet. Be the first to share yours!'
                        : 'No stories found for your search. Try a different keyword or category.'}
                    </p>
                  </div>
                ) : (
                  <div className="journal-grid">
                    {filteredJournals.map((j) => {
                      const colors = categoryColors[j.category] || { color: '#f2f4f7', text: '#344054' };
                      const isExpanded = expandedJournal === j._id;
                      return (
                        <div key={j._id} className="journal-card">
                          <div className="journal-banner" style={{ background: colors.color }}>
                            📖
                          </div>
                          <div className="journal-body">
                            <span className="journal-tag" style={{ background: colors.color, color: colors.text }}>
                              {j.category}
                            </span>
                            <div className="journal-title">{j.title}</div>
                            <div className="journal-excerpt">
                              {isExpanded ? j.storyText : `${j.storyText.substring(0, 80)}${j.storyText.length > 80 ? '...' : ''}`}
                            </div>
                            <div className="journal-meta">
                              <div className="journal-author">
                                <div className="author-avatar">{j.author?.[0] || 'A'}</div>
                                <span>
                                  {j.author} · {new Date(j.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <button
                                className="read-btn"
                                style={{ color: colors.text }}
                                onClick={() => setExpandedJournal(isExpanded ? null : j._id)}
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── SHARE TAB ── */}
            {activeTab === 'share' && (
              <div className="share-card">
                {submitted ? (
                  <div className="submit-success">
                    <div style={{ fontSize: '48px' }}>🎉</div>
                    <h2>Thank you for sharing!</h2>
                    <p>Your story has been submitted for review. It will be published once approved by our team.</p>
                  </div>
                ) : (
                  <>
                    <div className="share-info">
                      <span>ℹ️</span>
                      <p>Your experience could help another student feel less alone. All submissions are reviewed before publishing.</p>
                    </div>

                    {/* Story title */}
                    <div className="form-group">
                      <label className="form-label">Story title</label>
                      <input
                        className="form-input"
                        placeholder='e.g. "How I overcame exam anxiety"'
                        value={storyTitle}
                        onChange={(e) => setStoryTitle(e.target.value)}
                      />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <div className="category-row">
                        {['Anxiety', 'Depression', 'Recovery', 'Stress', 'Grief'].map((cat) => (
                          <button
                            key={cat}
                            className={`cat-btn ${storyCategory === cat ? 'active' : ''}`}
                            onClick={() => setStoryCategory(cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Story text */}
                    <div className="form-group">
                      <label className="form-label">Your story</label>
                      <textarea
                        className="story-textarea"
                        placeholder="Share your mental health journey. How did you feel? What helped you? What would you tell someone going through the same thing?..."
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        maxLength={1000}
                      />
                      <div style={{ textAlign: 'right', fontSize: '11px', color: '#98a2b3', marginTop: '4px' }}>
                        {storyText.length} / 1000
                      </div>
                    </div>

                    {/* Star rating */}
                    <div className="form-group">
                      <label className="form-label">Rate the counselling service</label>
                      <div className="star-row">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            className={`star-btn ${rating >= s ? 'filled' : ''}`}
                            onClick={() => setRating(s)}
                          >
                            ★
                          </button>
                        ))}
                        <span style={{ fontSize: '12px', color: '#667085', marginLeft: '8px' }}>
                          {rating > 0 ? `${rating} / 5` : 'Tap to rate'}
                        </span>
                      </div>
                    </div>

                    {/* Anonymous toggle */}
                    <div className="anon-box">
                      <div className="anon-row">
                        <div className="anon-left">
                          <span style={{ fontSize: '20px' }}>🥷</span>
                          <div>
                            <div className="anon-title">Keep anonymous</div>
                            <div className="anon-sub">Your name will not be shown publicly</div>
                          </div>
                        </div>
                        <div
                          className={`toggle ${isAnonymous ? 'on' : 'off'}`}
                          onClick={() => setIsAnonymous(!isAnonymous)}
                        >
                          <div className="toggle-knob" />
                        </div>
                      </div>
                      <div className="anon-publishing">
                        🔒 Publishing as: <strong>{isAnonymous ? 'Anonymous student' : 'Your name'}</strong>
                      </div>
                    </div>

                    <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit story'}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── TOOLS TAB ── */}
            {activeTab === 'tools' && (
              <div>
                <div className="tools-list">
                  {resources.map((r) => (
                    <div key={r.id} className="tool-card">
                      <div className="tool-icon" style={{ background: r.badgeColor }}>
                        {r.icon}
                      </div>
                      <div className="tool-info">
                        <div className="tool-title">{r.title}</div>
                        <div className="tool-desc">{r.desc}</div>
                        <span className="tool-badge" style={{ background: r.badgeColor, color: r.badgeText }}>
                          {r.badge}
                        </span>
                      </div>
                      <button className="tool-arrow">→</button>
                    </div>
                  ))}
                </div>

                {/* Crisis strip */}
                <div className="crisis-strip">
                  <span style={{ fontSize: '28px' }}>🆘</span>
                  <div>
                    <div className="crisis-title">Kenya mental health crisis helpline</div>
                    <div className="crisis-num">0800 723 253</div>
                    <div className="crisis-sub">Free · Available 24 hours a day, 7 days a week</div>
                  </div>
                  <div className="crisis-actions">
                    <a href="tel:0800723253" className="crisis-call">📞 Call now</a>
                    <button className="crisis-chat" onClick={() => navigate('/student/sessions')}>
                      💬 Chat with counsellor
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
