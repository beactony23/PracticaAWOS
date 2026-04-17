/**
 * Was or Were? — Puzzle Game
 * game.js
 */

// ─── Sentence bank ───────────────────────────────────────────────────────────
const ALL_SENTENCES = [
  { before: "I",    after: "happy yesterday.",              answer: "was"  },
  { before: "They", after: "at the park.",                  answer: "were" },
  { before: "She",  after: "a great teacher.",              answer: "was"  },
  { before: "We",   after: "very tired.",                   answer: "were" },
  { before: "He",   after: "late to class.",                answer: "was"  },
  { before: "You",  after: "my best friend.",               answer: "were" },
  { before: "It",   after: "a cold morning.",               answer: "was"  },
  { before: "They", after: "excited about the trip.",       answer: "were" },
  { before: "I",    after: "nervous before the exam.",      answer: "was"  },
  { before: "We",   after: "at the cinema last night.",     answer: "were" },
  { before: "She",  after: "the winner of the contest.",    answer: "was"  },
  { before: "He",   after: "a doctor for many years.",      answer: "was"  },
  { before: "You",  after: "right all along.",              answer: "were" },
  { before: "It",   after: "raining all day.",              answer: "was"  },
  { before: "They", after: "surprised by the news.",        answer: "were" },
  { before: "I",    after: "a student ten years ago.",      answer: "was"  },
  { before: "We",   after: "the first to arrive.",          answer: "were" },
  { before: "She",  after: "really kind to everyone.",      answer: "was"  },
  { before: "He",   after: "playing football yesterday.",   answer: "was"  },
  { before: "You",  after: "very brave.",                   answer: "were" },
];

const TOTAL_QUESTIONS = 10;

// ─── State ────────────────────────────────────────────────────────────────────
let queue     = [];
let idx       = 0;
let correct   = 0;
let total     = 0;
let streak    = 0;
let answered  = false;
let dragging  = null;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const sentenceDisplay = document.getElementById('sentence-display');
const piecesArea      = document.getElementById('pieces-area');
const feedbackEl      = document.getElementById('feedback');
const progFill        = document.getElementById('prog-fill');
const progLabel       = document.getElementById('prog-label');
const scCorrect       = document.getElementById('sc-correct');
const scTotal         = document.getElementById('sc-total');
const scStreak        = document.getElementById('sc-streak');
const winOverlay      = document.getElementById('win-overlay');
const winCorrect      = document.getElementById('win-correct');
const btnPlayAgain    = document.getElementById('btn-play-again');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateScore() {
  scCorrect.textContent = correct;
  scTotal.textContent   = total;
  scStreak.textContent  = streak;
  const pct = Math.round((idx / TOTAL_QUESTIONS) * 100);
  progFill.style.width  = pct + '%';
  progLabel.textContent = idx + ' / ' + TOTAL_QUESTIONS;
}

// ─── Render question ──────────────────────────────────────────────────────────
function renderQuestion() {
  const q  = queue[idx];
  answered = false;
  feedbackEl.textContent = '';
  feedbackEl.className   = 'feedback-msg';

  // Build sentence display
  sentenceDisplay.innerHTML = '';

  const before = document.createElement('span');
  before.className   = 'word-static';
  before.textContent = q.before;

  const slot = document.createElement('div');
  slot.className = 'blank-slot';
  slot.id        = 'slot';

  // Drag-and-drop events on slot
  slot.addEventListener('dragover',  e => { e.preventDefault(); slot.classList.add('drag-over'); });
  slot.addEventListener('dragleave', ()  => slot.classList.remove('drag-over'));
  slot.addEventListener('drop',      e  => {
    e.preventDefault();
    slot.classList.remove('drag-over');
    handleAnswer(e.dataTransfer.getData('text'));
  });

  const after = document.createElement('span');
  after.className   = 'word-static';
  after.textContent = q.after;

  sentenceDisplay.appendChild(before);
  sentenceDisplay.appendChild(slot);
  sentenceDisplay.appendChild(after);

  // Build pieces
  piecesArea.innerHTML = '';
  ['was', 'were'].forEach(word => {
    const p = document.createElement('div');
    p.className    = 'piece ' + word + '-piece';
    p.id           = 'piece-' + word;
    p.textContent  = word;
    p.draggable    = true;

    // Drag events
    p.addEventListener('dragstart', e => {
      dragging = word;
      e.dataTransfer.setData('text', word);
      p.style.opacity = '0.5';
    });
    p.addEventListener('dragend', () => {
      p.style.opacity = '';
      dragging = null;
    });

    // Touch / click fallback
    p.addEventListener('click',       () => handleAnswer(word));
    p.addEventListener('touchstart',  () => {}, { passive: true }); // keep active state snappy
    p.addEventListener('touchend',    e  => {
      e.preventDefault();
      handleAnswer(word);
    });

    piecesArea.appendChild(p);
  });
}

// ─── Handle answer ────────────────────────────────────────────────────────────
function handleAnswer(word) {
  if (answered) return;
  const q   = queue[idx];
  const slot = document.getElementById('slot');
  answered = true;
  total++;

  // Place piece visually
  slot.innerHTML = '';
  slot.classList.add('has-piece');
  const pp = document.createElement('span');
  pp.className   = 'placed-piece';
  pp.textContent = word;
  slot.appendChild(pp);

  // Mark used piece
  const usedPiece = document.getElementById('piece-' + word);
  if (usedPiece) usedPiece.classList.add('used');

  if (word === q.answer) {
    correct++;
    streak++;
    slot.classList.add('correct');
    if (streak >= 5)      feedbackEl.textContent = '🔥 ' + streak + ' in a row! Unstoppable!';
    else if (streak >= 3) feedbackEl.textContent = '🔥 ' + streak + ' in a row! Keep going!';
    else                  feedbackEl.textContent = '✓ Correct!';
    feedbackEl.className = 'feedback-msg ok';
  } else {
    streak = 0;
    slot.classList.add('incorrect');
    feedbackEl.textContent = '✗ Not quite! "' + q.before + '" needs "' + q.answer + '".';
    feedbackEl.className   = 'feedback-msg err';
  }

  updateScore();

  setTimeout(() => {
    idx++;
    if (idx >= TOTAL_QUESTIONS) {
      showWin();
    } else {
      renderQuestion();
    }
  }, 1800);
}

// ─── Win screen ───────────────────────────────────────────────────────────────
function showWin() {
  updateScore();
  winCorrect.textContent = correct;
  winOverlay.removeAttribute('hidden');
}

// ─── Init / restart ───────────────────────────────────────────────────────────
function init() {
  queue    = shuffle(ALL_SENTENCES).slice(0, TOTAL_QUESTIONS);
  idx      = 0;
  correct  = 0;
  total    = 0;
  streak   = 0;
  answered = false;
  winOverlay.setAttribute('hidden', '');
  updateScore();
  renderQuestion();
}

btnPlayAgain.addEventListener('click', init);

// Start!
init();
