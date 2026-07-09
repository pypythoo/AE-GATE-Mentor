/**
 * AeroMentor — GATE Aerospace AI Mentor
 * Frontend Application Logic
 */

'use strict';

const AeroApp = (() => {
  // ──────────────────────────────────────────────────────────────────────────
  // State
  // ──────────────────────────────────────────────────────────────────────────
  const state = {
    chatHistory: [],
    profile: {},
    scores: {},
    streak: 0,
    totalHours: 0,
    quizzesDone: 0,
    charts: {},
    motivationMessages: [
      '🚀 Every formula you master brings you one step closer to ISRO!',
      '✈️ GATE is a marathon — consistency beats intensity every time.',
      '🛸 Your dream of contributing to India\'s space program starts here.',
      '🔧 Engineering is understanding, not memorization. You\'ve got this!',
      '🌟 Top GATE rankers weren\'t born brilliant — they were consistently dedicated.',
      '📐 One solved problem today = one less barrier to your dream job.',
      '🎯 Focus on concepts, not marks. Marks follow understanding.',
      '🏆 DRDO, HAL, ISRO — your name will be there. Keep going!',
      '💡 When in doubt, go back to first principles. That\'s how engineers think.',
      '🌐 The aerospace industry needs YOUR unique mind. Don\'t give up.',
    ],
    subjects: [
      'Engineering Mathematics', 'Flight Mechanics', 'Aerodynamics', 'Propulsion',
      'Space Dynamics', 'Aircraft Structures', 'Thermodynamics', 'Fluid Mechanics',
      'Control Systems',
    ],
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Init
  // ──────────────────────────────────────────────────────────────────────────
  function init() {
    loadFromStorage();
    updateNavBadges();
    buildSubjectProgress();
    buildScoreInputs();
    buildSyllabusGrid();
    setMotivation();
    setGoals();
    initCharts();
    updateDashboardStats();
    // Auto-resize chat textarea
    const textarea = document.getElementById('chatInput');
    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      });
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Local Storage
  // ──────────────────────────────────────────────────────────────────────────
  function saveToStorage() {
    localStorage.setItem('aeromentor_profile', JSON.stringify(state.profile));
    localStorage.setItem('aeromentor_scores', JSON.stringify(state.scores));
    localStorage.setItem('aeromentor_streak', state.streak);
    localStorage.setItem('aeromentor_hours', state.totalHours);
    localStorage.setItem('aeromentor_quizzes', state.quizzesDone);
    localStorage.setItem('aeromentor_last_visit', new Date().toDateString());
  }

  function loadFromStorage() {
    try {
      const p = localStorage.getItem('aeromentor_profile');
      if (p) state.profile = JSON.parse(p);

      const s = localStorage.getItem('aeromentor_scores');
      if (s) state.scores = JSON.parse(s);

      state.streak = parseInt(localStorage.getItem('aeromentor_streak') || '0');
      state.totalHours = parseFloat(localStorage.getItem('aeromentor_hours') || '0');
      state.quizzesDone = parseInt(localStorage.getItem('aeromentor_quizzes') || '0');

      // Streak logic
      const last = localStorage.getItem('aeromentor_last_visit');
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (last === today) {
        // same day, keep streak
      } else if (last === yesterday) {
        state.streak += 1;
        saveToStorage();
      } else if (last && last !== today) {
        state.streak = 1;
        saveToStorage();
      } else {
        state.streak = 1;
        saveToStorage();
      }

      // Populate profile modal if profile saved
      if (state.profile.name) {
        setVal('profileName', state.profile.name);
        setVal('profileExamDate', state.profile.exam_date || '');
        setVal('profileHours', state.profile.daily_hours || 4);
        setVal('profileLevel', state.profile.level || 'Intermediate');
      }
    } catch (e) {
      console.warn('Storage load error:', e);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Profile
  // ──────────────────────────────────────────────────────────────────────────
  function saveProfile() {
    const weakSel = document.getElementById('profileWeakSubjects');
    const weakSubjects = weakSel
      ? Array.from(weakSel.selectedOptions).map(o => o.value)
      : [];

    state.profile = {
      name: getVal('profileName') || 'Aspirant',
      exam_date: getVal('profileExamDate') || '',
      daily_hours: parseInt(getVal('profileHours') || '4'),
      level: getVal('profileLevel') || 'Intermediate',
      weak_subjects: weakSubjects,
    };
    saveToStorage();
    updateNavBadges();
    buildSubjectProgress();
    setGoals();
    updateDashboardStats();
    showToast(`Profile saved! Welcome, ${state.profile.name}! 🚀`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────────────────────────────
  function showSection(name) {
    document.querySelectorAll('.ae-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => b.classList.remove('active'));
    const section = document.getElementById(`section-${name}`);
    if (section) section.classList.add('active');
    const btn = document.querySelector(`.sidebar-nav [data-section="${name}"]`);
    if (btn) btn.classList.add('active');
    // Lazy-init analytics charts when tab opens
    if (name === 'analytics') updateCharts();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Theme Toggle
  // ──────────────────────────────────────────────────────────────────────────
  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = isDark ? 'bi bi-sun' : 'bi bi-moon-stars';
    localStorage.setItem('aeromentor_theme', isDark ? 'light' : 'dark');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Nav Badges
  // ──────────────────────────────────────────────────────────────────────────
  function updateNavBadges() {
    // Streak
    document.getElementById('streakCount').textContent = state.streak;
    document.getElementById('dashStreak').textContent = state.streak;
    const streakBadge = document.getElementById('streakBadge');
    if (streakBadge) streakBadge.classList.remove('d-none');

    // Countdown
    if (state.profile.exam_date) {
      const diff = Math.ceil((new Date(state.profile.exam_date) - new Date()) / 86400000);
      const daysLeft = diff > 0 ? diff : 0;
      document.getElementById('daysLeft').textContent = daysLeft;
      document.getElementById('dashDays').textContent = daysLeft;
      const cb = document.getElementById('countdownBadge');
      if (cb) cb.classList.remove('d-none');
    }
  }

  function updateDashboardStats() {
    document.getElementById('dashHours').textContent = state.totalHours.toFixed(1);
    document.getElementById('dashQuizzes').textContent = state.quizzesDone;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Dashboard
  // ──────────────────────────────────────────────────────────────────────────
  function setMotivation() {
    const el = document.getElementById('motivationCard');
    if (!el) return;
    const msg = state.motivationMessages[Math.floor(Math.random() * state.motivationMessages.length)];
    el.textContent = `"${msg}"`;
  }

  function setGoals() {
    const el = document.getElementById('goalList');
    if (!el) return;
    const goals = state.profile.weak_subjects && state.profile.weak_subjects.length
      ? [
          `📖 Study ${state.profile.weak_subjects[0]} — cover 1 topic in depth`,
          `📐 Solve 5 GATE-level numericals from your weak area`,
          `🧠 Revise formulas for ${state.profile.weak_subjects[0] || 'any subject'}`,
          `✅ Take a 5-question quiz to test today's learning`,
          `📝 Write brief notes on 1 new concept you learned today`,
        ]
      : [
          '👤 Set up your profile to get personalized goals',
          '📚 Browse the syllabus and pick a subject to start',
          '💬 Ask AeroMentor your first GATE question',
        ];
    el.innerHTML = goals.map(g => `<li>${g}</li>`).join('');
  }

  function buildSubjectProgress() {
    const el = document.getElementById('subjectProgress');
    if (!el) return;
    el.innerHTML = state.subjects.map(subj => {
      const score = state.scores[subj] || 0;
      const isWeak = (state.profile.weak_subjects || []).includes(subj);
      return `
        <div class="subject-bar-row">
          <div class="subject-bar-label">
            <span>${subj}${isWeak ? ' ⚠️' : ''}</span>
            <span>${score}%</span>
          </div>
          <div class="subject-bar">
            <div class="subject-bar-fill" style="width:${score}%"></div>
          </div>
        </div>`;
    }).join('');
  }

  function buildScoreInputs() {
    const el = document.getElementById('scoreInputs');
    if (!el) return;
    el.innerHTML = state.subjects.map(subj => {
      const score = state.scores[subj] || 0;
      return `
        <div class="col-md-4 col-6">
          <label class="form-label small">${subj}</label>
          <input type="number" class="form-control ae-input" id="score-${subj.replace(/\s+/g,'_')}"
            value="${score}" min="0" max="100" placeholder="0–100" />
        </div>`;
    }).join('');
  }

  function saveScores() {
    state.subjects.forEach(subj => {
      const el = document.getElementById(`score-${subj.replace(/\s+/g,'_')}`);
      if (el) state.scores[subj] = parseInt(el.value || '0');
    });
    saveToStorage();
    buildSubjectProgress();
    updateCharts();
    showToast('Scores saved and charts updated! 📊');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Charts
  // ──────────────────────────────────────────────────────────────────────────
  function initCharts() {
    Chart.defaults.color = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-muted').trim() || '#8b91b5';

    // Coverage (radar / doughnut)
    const coverageCtx = document.getElementById('coverageChart');
    if (coverageCtx) {
      state.charts.coverage = new Chart(coverageCtx, {
        type: 'radar',
        data: {
          labels: state.subjects,
          datasets: [{
            label: 'Preparation %',
            data: state.subjects.map(s => state.scores[s] || 0),
            backgroundColor: 'rgba(79,142,247,0.15)',
            borderColor: '#4f8ef7',
            pointBackgroundColor: '#4f8ef7',
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
          plugins: { legend: { display: false } },
        },
      });
    }

    // Hours trend (bar)
    const hoursCtx = document.getElementById('hoursChart');
    if (hoursCtx) {
      const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      state.charts.hours = new Chart(hoursCtx, {
        type: 'bar',
        data: {
          labels: days,
          datasets: [{
            label: 'Study Hours',
            data: days.map(() => +(Math.random() * 5).toFixed(1)),
            backgroundColor: 'rgba(79,142,247,0.6)',
            borderColor: '#4f8ef7',
            borderWidth: 1,
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 8 } },
        },
      });
    }
  }

  function updateCharts() {
    if (state.charts.coverage) {
      state.charts.coverage.data.datasets[0].data = state.subjects.map(s => state.scores[s] || 0);
      state.charts.coverage.update();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Syllabus Grid
  // ──────────────────────────────────────────────────────────────────────────
  function buildSyllabusGrid() {
    fetch('/api/syllabus')
      .then(r => r.json())
      .then(syllabus => {
        const el = document.getElementById('syllabusGrid');
        if (!el) return;
        el.innerHTML = Object.entries(syllabus).map(([subj, topics]) => `
          <div class="col-md-6 col-lg-4">
            <div class="syllabus-card" onclick="AeroApp.askAboutSubject('${subj}')">
              <div class="subj-title"><i class="bi bi-book me-1"></i>${subj}</div>
              <div>${topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}</div>
              <div class="mt-2 small text-muted">Click to study with AI →</div>
            </div>
          </div>`).join('');
      })
      .catch(() => {
        const el = document.getElementById('syllabusGrid');
        if (el) el.innerHTML = '<p class="text-muted">Could not load syllabus.</p>';
      });
  }

  function askAboutSubject(subj) {
    showSection('chat');
    sendQuick(`What are the most important GATE AE topics in ${subj}? Give me a prioritized study guide.`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Chat
  // ──────────────────────────────────────────────────────────────────────────
  function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    input.style.height = 'auto';
    appendMessage('user', msg);
    state.chatHistory.push({ role: 'user', content: msg });
    showTyping();
    document.getElementById('sendBtn').disabled = true;

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        history: state.chatHistory.slice(-12),
        profile: state.profile,
      }),
    })
      .then(r => r.json())
      .then(data => {
        hideTyping();
        document.getElementById('sendBtn').disabled = false;
        if (data.error) {
          appendMessage('ai', `⚠️ **Error:** ${data.error}`);
        } else {
          const reply = data.reply || data.response || 'No response received.';
          appendMessage('ai', reply);
          state.chatHistory.push({ role: 'assistant', content: reply });
          state.totalHours += 0.01; // small increment per message
          saveToStorage();
        }
      })
      .catch(err => {
        hideTyping();
        document.getElementById('sendBtn').disabled = false;
        appendMessage('ai', `⚠️ **Connection error:** ${err.message}. Please check your server.`);
      });
  }

  function sendQuick(msg) {
    document.getElementById('chatInput').value = msg;
    sendMessage();
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function appendMessage(role, content) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
    const avatar = role === 'user' ? '👤' : '🚀';
    const parsed = typeof marked !== 'undefined' ? marked.parse(content) : escapeHtml(content);
    div.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-bubble">${parsed}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.id = 'typingIndicator';
    div.className = 'message ai-message';
    div.innerHTML = `
      <div class="message-avatar">🚀</div>
      <div class="typing-dots"><span></span><span></span><span></span></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function clearChat() {
    document.getElementById('chatMessages').innerHTML = '';
    state.chatHistory = [];
    appendMessage('ai', '💬 Chat cleared. Ready for your next question!');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Study Plan
  // ──────────────────────────────────────────────────────────────────────────
  function generateStudyPlan() {
    const examDate = getVal('planExamDate');
    const dailyHours = getVal('planDailyHours') || '4';
    const level = getVal('planLevel') || 'Intermediate';
    const weakSel = document.getElementById('planWeakSubjects');
    const weakSubjects = weakSel
      ? Array.from(weakSel.selectedOptions).map(o => o.value)
      : [];

    const outputEl = document.getElementById('studyPlanOutput');
    const contentEl = document.getElementById('planContent');
    outputEl.style.display = 'none';
    contentEl.innerHTML = `<div class="ae-spinner"><div class="spinner-border text-accent"></div> Generating your personalized study plan…</div>`;
    outputEl.style.display = 'block';

    fetch('/api/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exam_date: examDate,
        daily_hours: parseInt(dailyHours),
        level,
        weak_subjects: weakSubjects,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          contentEl.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
        } else {
          const plan = data.plan || '';
          contentEl.innerHTML = typeof marked !== 'undefined' ? marked.parse(plan) : `<pre>${plan}</pre>`;
          showToast('Study plan generated! 📅');
        }
      })
      .catch(err => {
        contentEl.innerHTML = `<p class="text-danger">Connection error: ${err.message}</p>`;
      });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Quiz
  // ──────────────────────────────────────────────────────────────────────────
  function generateQuiz() {
    const subject = getVal('quizSubject') || 'Aerodynamics';
    const numQ = getVal('quizCount') || '5';
    const difficulty = getVal('quizDifficulty') || 'Intermediate';

    const outputEl = document.getElementById('quizOutput');
    const contentEl = document.getElementById('quizContent');
    const titleEl = document.getElementById('quizTitle');

    titleEl.textContent = `${subject} Quiz — ${difficulty}`;
    outputEl.style.display = 'none';
    contentEl.innerHTML = `<div class="ae-spinner"><div class="spinner-border text-accent"></div> Generating ${numQ} ${difficulty} questions on ${subject}…</div>`;
    outputEl.style.display = 'block';

    fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, num_questions: parseInt(numQ), difficulty }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          contentEl.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
        } else {
          const quiz = data.quiz || '';
          contentEl.innerHTML = typeof marked !== 'undefined' ? marked.parse(quiz) : `<pre>${quiz}</pre>`;
          state.quizzesDone += 1;
          saveToStorage();
          updateDashboardStats();
          showToast(`Quiz ready! Test yourself on ${subject} 🎯`);
        }
      })
      .catch(err => {
        contentEl.innerHTML = `<p class="text-danger">Connection error: ${err.message}</p>`;
      });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Formula Sheet
  // ──────────────────────────────────────────────────────────────────────────
  function generateFormulaSheet() {
    const subject = getVal('formulaSubject') || 'Aerodynamics';

    const outputEl = document.getElementById('formulaOutput');
    const contentEl = document.getElementById('formulaContent');
    const titleEl = document.getElementById('formulaTitle');

    titleEl.textContent = `${subject} — Formula Sheet`;
    outputEl.style.display = 'none';
    contentEl.innerHTML = `<div class="ae-spinner"><div class="spinner-border text-accent"></div> Generating formula sheet for ${subject}…</div>`;
    outputEl.style.display = 'block';

    fetch('/api/formula-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          contentEl.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
        } else {
          const sheet = data.sheet || data.formulas || '';
          contentEl.innerHTML = typeof marked !== 'undefined' ? marked.parse(sheet) : `<pre>${sheet}</pre>`;
          showToast(`Formula sheet for ${subject} ready! 📐`);
        }
      })
      .catch(err => {
        contentEl.innerHTML = `<p class="text-danger">Connection error: ${err.message}</p>`;
      });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Utilities
  // ──────────────────────────────────────────────────────────────────────────
  function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText || el.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard! 📋');
    }).catch(() => {
      showToast('Copy failed — please select and copy manually.');
    });
  }

  function showToast(msg) {
    document.getElementById('toastMessage').textContent = msg;
    const toastEl = document.getElementById('appToast');
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
    toast.show();
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Public API
  // ──────────────────────────────────────────────────────────────────────────
  return {
    init,
    showSection,
    toggleTheme,
    saveProfile,
    sendMessage,
    sendQuick,
    handleKey,
    clearChat,
    generateStudyPlan,
    generateQuiz,
    generateFormulaSheet,
    saveScores,
    copyToClipboard,
    askAboutSubject,
  };
})();

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  // Restore theme
  const saved = localStorage.getItem('aeromentor_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  AeroApp.init();
});
