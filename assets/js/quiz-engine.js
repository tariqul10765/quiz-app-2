/* Quiz Engine - Shared JavaScript functionality */

// Helper functions
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// Quiz Engine Class
class QuizEngine {
  constructor(questions, options = {}) {
    this.questions = questions;
    this.options = {
      autoAdvance: true,
      showTimer: true,
      allowSkip: true,
      ...options
    };
    
    this.state = {
      order: [],
      idx: 0,
      score: 0,
      answered: {},
      start: Date.now(),
      auto: this.options.autoAdvance,
      mode: 'Mixed'
    };
    
    this.init();
  }

  init() {
    // Randomize questions & MCQ options
    this.state.order = shuffle(this.questions.map((q, i) => ({
      ...q,
      _i: i,
      _optOrder: q.type === 'mcq' ? shuffle(q.opts.map((_, k) => k)) : []
    })));
    
    this.state.idx = 0;
    this.state.score = 0;
    this.state.answered = {};
    this.state.start = Date.now();
    
    this.render();
    this.startTimer();
  }

  current() {
    return this.state.order[this.state.idx];
  }

  render() {
    const q = this.current();
    
    // Update header elements
    $('#type-badge').textContent = q.type.toUpperCase();
    $('#q-pill').textContent = `Q ${this.state.idx + 1} / ${this.state.order.length}`;
    $('#score-pill').textContent = `Score: ${this.state.score}`;
    $('#mode-pill').textContent = `Mode: ${this.state.mode}`;
    
    const pct = (this.state.idx / this.state.order.length) * 100;
    $('#bar').style.width = pct + '%';

    // Render question
    const c = $('#q-container');
    c.innerHTML = '';
    
    const qEl = document.createElement('div');
    qEl.className = 'q-text';
    qEl.textContent = q.q;
    c.appendChild(qEl);

    // Render options based on question type
    if (q.type === 'mcq') {
      this.renderMCQ(q);
    } else if (q.type === 'tf') {
      this.renderTrueFalse(q);
    } else if (q.type === 'fill') {
      this.renderFillIn(q);
    }

    // Reset feedback and buttons
    const fb = $('#feedback');
    fb.className = 'feedback';
    fb.textContent = '';
    
    $('#btn-submit').disabled = false;
    $('#btn-next').disabled = true;
    $('#btn-prev').disabled = this.state.idx === 0;
    $('#btn-skip').disabled = !this.options.allowSkip;
  }

  renderMCQ(q) {
    const box = document.createElement('div');
    box.className = 'options';
    
    q._optOrder.forEach((optIdx) => {
      const optEl = document.createElement('div');
      optEl.className = 'opt';
      optEl.tabIndex = 0;
      optEl.dataset.value = optIdx;
      optEl.textContent = q.opts[optIdx];
      
      optEl.addEventListener('click', () => this.selectOption(optEl));
      optEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectOption(optEl);
        }
      });
      
      box.appendChild(optEl);
    });
    
    $('#q-container').appendChild(box);
  }

  renderTrueFalse(q) {
    const box = document.createElement('div');
    box.className = 'options';
    
    ['True', 'False'].forEach((label, val) => {
      const optEl = document.createElement('div');
      optEl.className = 'opt';
      optEl.dataset.value = (label === 'True');
      optEl.textContent = label;
      
      optEl.addEventListener('click', () => this.selectOption(optEl));
      optEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectOption(optEl);
        }
      });
      
      box.appendChild(optEl);
    });
    
    $('#q-container').appendChild(box);
  }

  renderFillIn(q) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your answer…';
    input.style.cssText = 'width:100%;padding:12px;border-radius:12px;border:1px solid #263246;background:#0b1220;color:#e5e7eb';
    input.id = 'fill';
    
    $('#q-container').appendChild(input);
    setTimeout(() => input.focus(), 50);
  }

  selectOption(el) {
    $$('.opt').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
  }

  getUserAnswer() {
    const q = this.current();
    
    if (q.type === 'mcq') {
      const sel = $('.opt.selected');
      return sel ? parseInt(sel.dataset.value, 10) : null;
    }
    
    if (q.type === 'tf') {
      const sel = $('.opt.selected');
      return sel ? (sel.dataset.value === 'true') : null;
    }
    
    if (q.type === 'fill') {
      const v = $('#fill').value.trim();
      return v || null;
    }
    
    return null;
  }

  checkAnswer() {
    const q = this.current();
    const fb = $('#feedback');
    const user = this.getUserAnswer();
    
    if (user === null) {
      fb.textContent = 'Please select or type an answer.';
      fb.classList.add('show');
      return;
    }

    let ok = false, your, correct;
    
    if (q.type === 'mcq') {
      const picked = user;
      const right = q.ans;
      your = q.opts[picked];
      correct = q.opts[right];
      ok = (picked === right);
      
      $$('.opt').forEach(o => {
        const val = parseInt(o.dataset.value, 10);
        o.classList.remove('selected');
        if (val === right) o.classList.add('correct');
        if (val === picked && val !== right) o.classList.add('wrong');
      });
    } else if (q.type === 'tf') {
      const pickedBool = !!user;
      const rightBool = !!q.ans;
      your = pickedBool ? 'True' : 'False';
      correct = rightBool ? 'True' : 'False';
      ok = (pickedBool === rightBool);
      
      $$('.opt').forEach(o => {
        const val = (o.dataset.value === 'true');
        if (val === rightBool) o.classList.add('correct');
        if (val === pickedBool && val !== rightBool) o.classList.add('wrong');
      });
    } else if (q.type === 'fill') {
      const accepted = q.ans.map(s => s.toLowerCase().replace(/\s+/g, '').trim());
      const normalized = String(user).toLowerCase().replace(/\s+/g, '').trim();
      ok = accepted.includes(normalized);
      your = String(user);
      correct = q.ans[0];
    }

    if (ok) this.state.score += q.points;
    this.state.answered[q.id] = { your, correct, ok, type: q.type, q: q.q };

    fb.innerHTML = (ok ? `<strong class="success">Correct.</strong>` : `<strong class="error">Incorrect.</strong>`) + ` ${q.exp ? ' ' + q.exp : ''}`;
    fb.classList.add('show');

    $('#btn-submit').disabled = true;
    $('#btn-next').disabled = (this.state.idx >= this.state.order.length - 1);

    if (this.state.auto && this.state.idx < this.state.order.length - 1) {
      setTimeout(() => this.goNext(), 1200);
    }
    
    this.updateHeader();
  }

  updateHeader() {
    $('#score-pill').textContent = `Score: ${this.state.score}`;
    $('#q-pill').textContent = `Q ${this.state.idx + 1} / ${this.state.order.length}`;
    $('#mode-pill').textContent = `Mode: ${this.state.mode}`;
    $('#bar').style.width = ((this.state.idx) / this.state.order.length * 100) + '%';
  }

  goNext() {
    if (this.state.idx < this.state.order.length - 1) {
      this.state.idx++;
      this.render();
    } else {
      this.finish();
    }
  }

  goPrev() {
    if (this.state.idx > 0) {
      this.state.idx--;
      this.render();
    }
  }

  skip() {
    this.state.idx++;
    if (this.state.idx >= this.state.order.length) {
      this.finish();
    } else {
      this.render();
    }
  }

  finish() {
    $('#quiz-card').style.display = 'none';
    
    const total = this.state.order.reduce((s, q) => s + q.points, 0);
    const time = Math.round((Date.now() - this.state.start) / 1000);
    const pct = Math.round((this.state.score / total) * 100);
    const correct = Object.values(this.state.answered).filter(a => a.ok).length;
    
    const summary = `You scored ${this.state.score} / ${total} (${pct}%). Correct: ${correct} of ${this.state.order.length}. Time: ${time}s.`;
    $('#summary').textContent = summary;
    
    // Breakdown chips
    const types = ['mcq', 'tf', 'fill'];
    const box = $('#breakdown');
    box.innerHTML = '';
    
    types.forEach(t => {
      const totalT = this.state.order.filter(q => q.type === t).length;
      const okT = Object.values(this.state.answered).filter(a => a.type === t && a.ok).length;
      if (totalT > 0) {
        const chip = document.createElement('span');
        chip.className = 'badge';
        chip.textContent = `${t.toUpperCase()}: ${okT}/${totalT}`;
        box.appendChild(chip);
      }
    });
    
    // Review table
    const tb = $('#review-table tbody');
    tb.innerHTML = '';
    
    this.state.order.forEach((q, i) => {
      const a = this.state.answered[q.id] || {
        your: '—',
        ok: false,
        correct: q.type === 'tf' ? (q.ans ? 'True' : 'False') : (q.type === 'mcq' ? q.opts[q.ans] : (q.ans[0]))
      };
      
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i + 1}</td><td>${q.type.toUpperCase()}</td><td>${q.q}</td><td>${a.your}</td><td>${a.correct}</td><td>${a.ok ? '✅' : '❌'}</td>`;
      tb.appendChild(tr);
    });
    
    $('#result-card').style.display = 'block';
  }

  startTimer() {
    if (!this.options.showTimer) return;
    
    setInterval(() => {
      const s = Math.round((Date.now() - (this.state.start || Date.now())) / 1000);
      $('#timer').textContent = `Time: ${s}s`;
    }, 1000);
  }

  restart() {
    $('#result-card').style.display = 'none';
    $('#quiz-card').style.display = 'block';
    this.init();
  }

  setAutoAdvance(enabled) {
    this.state.auto = enabled;
    $('#auto-state').textContent = this.state.auto ? 'On' : 'Off';
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizEngine;
}
