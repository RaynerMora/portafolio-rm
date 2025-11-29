
const FORCE_SEVEN = false;

let secretNumber;
let attempts;
let historyList = [];

document.addEventListener('DOMContentLoaded', function () {
  const tryBtn = document.getElementById('tryBtn');
  const newBtn = document.getElementById('newBtn');
  const input = document.getElementById('guess');

  tryBtn.addEventListener('click', handleTry);
  newBtn.addEventListener('click', initGame);

  input.addEventListener('input', validateInput);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleTry();
  });

  initGame();
});

function generarNumeroSecreto() {
  return FORCE_SEVEN ? 7 : Math.floor(Math.random() * 10) + 1;
}

function initGame() {
  secretNumber = generarNumeroSecreto();
  attempts = 0;
  historyList = [];
  updateAttempts();
  setMessage('Empieza el juego, intenta adivinar.', '');
  renderHistory();
  setResultSummary('');
  enableInput(true);
  clearInput();
  clearValidation();
}

function setMessage(text, type) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.className = 'message';
  if (type === 'success') msg.classList.add('success');
  if (type === 'warn') msg.classList.add('warn');
}

function updateAttempts() {
  const el = document.getElementById('attemptsInfo');
  el.textContent = 'Intentos: ' + attempts;
}

function clearInput() {
  const input = document.getElementById('guess');
  input.value = '';
  input.focus();
}

function enableInput(enabled) {
  document.getElementById('guess').disabled = !enabled;
  document.getElementById('tryBtn').disabled = !enabled;
}

function validateInput() {
  const input = document.getElementById('guess');
  const val = input.value.trim();
  const validation = document.getElementById('validation');

  if (val === '') {
    input.classList.remove('error');
    validation.textContent = '';
    return false;
  }

  const num = Number(val);
  if (!Number.isInteger(num) || num < 1 || num > 10) {
    input.classList.add('error');
    validation.textContent = 'Ingresa un número entero entre 1 y 10.';
    return false;
  }

  input.classList.remove('error');
  validation.textContent = '';
  return true;
}

function clearValidation() {
  const input = document.getElementById('guess');
  const validation = document.getElementById('validation');
  input.classList.remove('error');
  validation.textContent = '';
}

function handleTry() {
  const input = document.getElementById('guess');
  const value = input.value.trim();

  if (value === '') {
    input.classList.add('error');
    document.getElementById('validation').textContent = 'Por favor ingresa un número.';
    input.focus();
    return;
  }

  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > 10) {
    input.classList.add('error');
    document.getElementById('validation').textContent = 'Ingresa un número válido entre 1 y 10.';
    clearInput();
    return;
  }

  attempts += 1;
  updateAttempts();

  let entry = { attempt: attempts, guess: num, result: '' };

  if (num === secretNumber) {
    const intentoText = attempts === 1 ? 'intento' : 'intentos';
    setMessage('¡Felicidades! Adivinaste el número secreto en solo'+ attempts + ' ' + intentoText + '.', 'success');
    entry.result = 'acertó';
    historyList.unshift(entry);
    renderHistory();
    setResultSummary('Adivinaste en ' + attempts + ' ' + intentoText + '.');
    enableInput(false);
  } else if (num < secretNumber) {
    setMessage('El número secreto es mayor que ' + num + '.', 'warn');
    entry.result = 'mayor';
    historyList.unshift(entry);
    renderHistory();
  } else {
    setMessage('El número secreto es menor que ' + num + '.', 'warn');
    entry.result = 'menor';
    historyList.unshift(entry);
    renderHistory();
  }

  clearValidation();
  clearInput();
}

function renderHistory() {
  const ul = document.getElementById('history');
  ul.innerHTML = '';
  if (historyList.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Aún no hay intentos.';
    ul.appendChild(li);
    return;
  }

  historyList.forEach(item => {
    const li = document.createElement('li');
    li.textContent = 'Intento ' + item.attempt + ': ' + item.guess + ' → ' + (item.result === 'acertó' ? 'Acierto' : (item.result === 'mayor' ? 'Se busca mayor' : 'Se busca menor'));
    if (item.result === 'acertó') li.classList.add('success');
    if (item.result === 'mayor' || item.result === 'menor') li.classList.add('warn');
    ul.appendChild(li);
  });
}

function setResultSummary(text) {
  document.getElementById('resultSummary').textContent = text;
}
