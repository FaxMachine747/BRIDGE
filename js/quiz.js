// Self-check quiz: question array + instant per-answer feedback + final score.
// Vanilla JS only, per the Materials specification (no framework, no backend).

const questions = [
  {
    prompt: "Your autistic classmate doesn't answer right after you ask them a question. What's the most likely reason?",
    options: [
      "They're ignoring you on purpose",
      "They need a little more time to process and reply",
      "They didn't hear you",
    ],
    correct: 1,
    feedback: "Many autistic people need more processing time before responding. Waiting a few extra seconds, instead of repeating or rephrasing the question, usually works better.",
    guideHref: "guide-school.html",
    guideLabel: "At School guide",
  },
  {
    prompt: "An autistic coworker looks away while you're talking to them. What does this usually mean?",
    options: [
      "They're bored or not interested",
      "They're being rude",
      "It may actually help them concentrate on what you're saying",
    ],
    correct: 2,
    feedback: "For many autistic people, looking away frees up cognitive resources to focus on listening, rather than signalling disinterest.",
    guideHref: "guide-work.html",
    guideLabel: "At Work guide",
  },
  {
    prompt: "What does the 'double empathy problem' research suggest?",
    options: [
      "Only autistic people struggle to communicate",
      "Miscommunication goes both ways between autistic and non-autistic people",
      "Autistic people don't want to communicate with anyone",
    ],
    correct: 1,
    feedback: "Research by Milton (2012) and later studies (Crompton et al., 2020) found communication breakdowns are a two-way mismatch, not a one-sided deficit.",
    guideHref: "about.html",
    guideLabel: "About & Sources",
  },
  {
    prompt: "Your autistic friend gives a very direct, blunt answer. What's the best response?",
    options: [
      "Assume they're being deliberately rude",
      "Recognise directness as a valid communication style and respond to the content",
      "Stop talking to them",
    ],
    correct: 1,
    feedback: "Direct, literal language is a common and valid autistic communication style, not an insult.",
    guideHref: "guide-online.html",
    guideLabel: "Online guide",
  },
  {
    prompt: "What's a helpful thing to do before a conversation with someone you know gets overwhelmed by noise or bright light?",
    options: [
      "Nothing, it's not your responsibility",
      "Suggest moving somewhere quieter or dimmer if possible",
      "Talk louder so they pay attention",
    ],
    correct: 1,
    feedback: "Small environmental adjustments (quieter space, softer lighting) can make a real difference to someone experiencing sensory overload.",
    guideHref: "guide-public.html",
    guideLabel: "In Public guide",
  },
];

let current = 0;
let score = 0;

const promptEl = document.getElementById('quiz-prompt');
const optionsEl = document.getElementById('quiz-options');
const feedbackEl = document.getElementById('quiz-feedback');
const progressEl = document.getElementById('quiz-progress');
const progressTrackEl = document.getElementById('quiz-progress-track');
const nextBtn = document.getElementById('quiz-next');
const quizBody = document.getElementById('quiz-body');
const quizResult = document.getElementById('quiz-result');

function buildProgressTrack() {
  progressTrackEl.innerHTML = '';
  questions.forEach(function () {
    const seg = document.createElement('span');
    seg.className = 'quiz-seg';
    progressTrackEl.appendChild(seg);
  });
}

function updateProgressTrack() {
  const segs = progressTrackEl.querySelectorAll('.quiz-seg');
  segs.forEach(function (seg, i) {
    seg.classList.toggle('filled', i < current);
    seg.classList.toggle('active', i === current);
  });
  progressTrackEl.setAttribute('aria-valuenow', current);
}

function renderQuestion() {
  const q = questions[current];
  progressEl.textContent = `Question ${current + 1} of ${questions.length}`;
  updateProgressTrack();
  promptEl.textContent = q.prompt;
  optionsEl.innerHTML = '';
  feedbackEl.className = 'quiz-feedback';
  feedbackEl.textContent = '';
  nextBtn.style.display = 'none';

  q.options.forEach((optionText, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option';
    btn.textContent = optionText;
    btn.addEventListener('click', () => handleAnswer(i, btn));
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, btnEl) {
  const q = questions[current];
  const allButtons = optionsEl.querySelectorAll('.quiz-option');
  allButtons.forEach((b) => (b.disabled = true));

  let message;
  if (selectedIndex === q.correct) {
    btnEl.classList.add('correct');
    score++;
    message = 'That\'s right. ' + q.feedback;
  } else {
    btnEl.classList.add('incorrect');
    allButtons[q.correct].classList.add('correct');
    message = 'Not quite. ' + q.feedback;
  }
  feedbackEl.innerHTML = `<p style="margin:0 0 10px;">${message}</p>` +
    `<a href="${q.guideHref}" style="font-weight:700;">Read more in the ${q.guideLabel} →</a>`;
  feedbackEl.classList.add('show');
  nextBtn.style.display = 'inline-flex';
  nextBtn.focus();
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizBody.style.display = 'none';
  quizResult.style.display = 'block';
  quizResult.innerHTML = `
    <p class="quiz-progress">Quiz complete</p>
    <div class="score">${score} / ${questions.length}</div>
    <p>${resultMessage(score, questions.length)}</p>
    <button type="button" class="btn btn-outline" id="quiz-restart">Try again</button>
  `;
  document.getElementById('quiz-restart').addEventListener('click', restartQuiz);
}

function resultMessage(s, total) {
  if (s === total) return "You've got a strong grasp of these everyday communication basics.";
  if (s >= total - 2) return "You're most of the way there, review the guides for the questions you missed.";
  return "A good starting point, the scenario guides above go deeper into each of these situations.";
}

function restartQuiz() {
  current = 0;
  score = 0;
  quizResult.style.display = 'none';
  quizBody.style.display = 'block';
  renderQuestion();
}

if (promptEl) {
  nextBtn.addEventListener('click', nextQuestion);
  buildProgressTrack();
  renderQuestion();
}
