import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/MoodCheckIn.css';
import '../styles/Sidebar.css';
import { saveMoodCheckIn } from '../api';

const moods = [
  { id: 1, emoji: '😞', label: 'Terrible', color: '#ef4444', light: '#fee2e2' },
  { id: 2, emoji: '😕', label: 'Low',      color: '#f97316', light: '#ffedd5' },
  { id: 3, emoji: '😐', label: 'Okay',     color: '#eab308', light: '#fef9c3' },
  { id: 4, emoji: '🙂', label: 'Good',     color: '#22c55e', light: '#dcfce7' },
  { id: 5, emoji: '😄', label: 'Great',    color: '#3b82f6', light: '#dbeafe' },
];

const tags = [
  'Anxious', 'Stressed', 'Tired', 'Lonely',
  'Hopeful', 'Calm', 'Overwhelmed', 'Grateful',
  'Sad', 'Excited', 'Confused', 'Motivated',
];

const MoodCheckIn = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [journal, setJournal] = useState('');
  const [saved, setSaved] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
  if (!selectedMood) {
    alert('Please select how you are feeling today.');
    return;
  }

  try {
    await saveMoodCheckIn({
      moodScore: selectedMood.id,
      moodLabel: selectedMood.label,
      tags: selectedTags,
      journalEntry: journal,
    });

    setSaved(true);
    setTimeout(() => {
      navigate('/student/dashboard');
    }, 2000);
  } catch (error) {
    alert('Something went wrong while saving your mood entry. Please try again.');
    console.error(error);
  }
};

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>

        <div className="mood-page">

          {/* Header */}
          <div className="mood-header">
            <div className="mood-header-left">
              <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
                ← Back
              </button>
              <div>
                <h1 className="mood-title">How are you feeling?</h1>
                <p className="mood-date">{today}</p>
              </div>
            </div>
            <div className="mood-header-icon">🧠</div>
          </div>

          <div className="mood-content">

            {/* Mood selector */}
            <div className="mood-card">
              <div className="section-label">Select your mood</div>
              <div className="mood-emojis">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    className={`mood-btn ${selectedMood?.id === mood.id ? 'selected' : ''}`}
                    style={selectedMood?.id === mood.id
                      ? { background: mood.light, border: `2px solid ${mood.color}` }
                      : {}}
                    onClick={() => setSelectedMood(mood)}
                  >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span
                      className="mood-label"
                      style={selectedMood?.id === mood.id ? { color: mood.color } : {}}
                    >
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Mood scale bar */}
              {selectedMood && (
                <div className="mood-scale">
                  <div className="scale-bar">
                    <div
                      className="scale-fill"
                      style={{
                        width: `${(selectedMood.id / 5) * 100}%`,
                        background: selectedMood.color,
                      }}
                    />
                  </div>
                  <div className="scale-labels">
                    <span>Very low</span>
                    <span>Neutral</span>
                    <span>Very high</span>
                  </div>
                </div>
              )}
            </div>

            {/* Contributing tags */}
            <div className="mood-card">
              <div className="section-label">What is contributing to your mood?</div>
              <div className="tags-grid">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Journal */}
            <div className="mood-card">
              <div className="section-label">Write your thoughts</div>
              <textarea
                className="journal-textarea"
                placeholder="How are you feeling today? What is on your mind? Your thoughts are private and encrypted..."
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                maxLength={500}
              />
              <div className="journal-footer">
                <span className="journal-privacy">🔒 Your entry is private and encrypted</span>
                <span className="char-count">{journal.length} / 500</span>
              </div>
            </div>

            {/* Save button */}
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? '✅ Entry saved! Redirecting...' : "💾 Save today's entry"}
            </button>

            {/* Help footer */}
            <div className="help-footer">
              <div className="help-left">
                <span className="help-icon">🆘</span>
                <div>
                  <div className="help-title">Feeling overwhelmed?</div>
                  <div className="help-sub">You do not have to face this alone. Reach out now.</div>
                </div>
              </div>
              <div className="help-buttons">
                <a href="tel:0800723253" className="help-btn help-call">
                  📞 Call now
                </a>
                <button
                  className="help-btn help-chat"
                  onClick={() => navigate('/student/sessions')}
                >
                  💬 Chat with counsellor
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MoodCheckIn;