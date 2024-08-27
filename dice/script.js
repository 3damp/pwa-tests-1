
const faceCount = document.getElementById('face-count');
const dieContainer = document.getElementById('die-container');
const total = document.getElementById('total');

let faces = parseInt(localStorage.getItem('faces')) || 6;
let diceSaved = JSON.parse(localStorage.getItem('dice')) || [{ color: randomColor() }];
const dieElements = [];

updateFaceCount();


function init() {
  let sum = 0;
  for (let i = 0; i < diceSaved.length; i++) {
    const die = createDieElement(diceSaved[i].value, diceSaved[i].color);
    dieElements.push(die);
    dieContainer.appendChild(die);
    sum += diceSaved[i].value ?? 0;
  }
  total.innerText = sum;
}
init();

function createDieElement(value, color) {
  const die = document.createElement('div');
  die.style.backgroundColor = color;
  die.innerText = value ?? '?';
  die.classList.add('die');
  return die;
}

function startRoll() {
  const ticks = 9;
  let totalTickCount = 0;
  let dotTickCount = 0;
  total.innerText = '.';

  const interval = setInterval(() => {
    totalTickCount++;
    dotTickCount++;
    if (totalTickCount >= ticks) {
      clearInterval(interval);
      endRoll();
      return;
    }
    if (dotTickCount >= (ticks / 3)) {
      dotTickCount = 0;
      total.innerText += '.';
    }
    rollTick();
  }, 100);
}

function endRoll() {
  let sum = 0;
  dieElements.forEach((die, index) => {
    const value = Math.ceil(Math.random() * faces);
    diceSaved[index].value = value;
    die.innerText = value;
    sum += value;
  });
  total.innerText = sum;
  saveDice();
}

function rollTick() {
  dieElements.forEach((die, index) => {
    const value = Math.ceil(Math.random() * faces);
    die.innerText = value;
  });
}

function addDie() {
  const color = randomColor();
  diceSaved.push({ color });
  const die = createDieElement(undefined, color);
  dieElements.push(die);
  dieContainer.appendChild(die);
  updateFaceCount();
  saveDice();
}
function removeDie() {
  if (dieElements.length < 1) return;
  const die = dieElements.pop();
  die.remove();
  diceSaved.pop();
  updateFaceCount();
  saveDice();
}

function addFace() {
  setFaces(faces + 1);
}
function removeFace() {
  setFaces(faces - 1);
}
function setFaces(value) {
  faces = value;
  localStorage.setItem('faces', faces);
  updateFaceCount();
}
function updateFaceCount() {
  faceCount.innerText = diceSaved.length + ' x D' + faces;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function saveDice() {
  localStorage.setItem('dice', JSON.stringify(diceSaved));
}


// Install button
let installPrompt = null;
const installButton = document.querySelector("#install");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.removeAttribute("hidden");
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }
  const result = await installPrompt.prompt();
  console.log(`Install prompt was: ${result.outcome}`);
  disableInAppInstallPrompt();
});

function disableInAppInstallPrompt() {
  installPrompt = null;
  installButton.setAttribute("hidden", "");
}

window.addEventListener("appinstalled", () => {
  disableInAppInstallPrompt();
});

function disableInAppInstallPrompt() {
  installPrompt = null;
  installButton.setAttribute("hidden", "");
}