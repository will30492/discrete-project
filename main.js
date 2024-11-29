// main.js

// Game Data
const levels = [
  {
    levelNumber: 1,
    inputs: { A: 1, B: 0 },
    desiredOutput: 1,
    availableGates: ['AND', 'OR'],
  },
  {
    levelNumber: 2,
    inputs: { A: 0, B: 1 },
    desiredOutput: 1,
    availableGates: ['AND', 'NOT'],
  },
  // Add more levels as needed
];

let currentLevelIndex = 0;
let gates = [];
let connections = [];
let inputs = {};
let outputGate = null;

// Canvas and Context
const canvas = document.getElementById('circuit-canvas');
const ctx = canvas.getContext('2d');

// Initialize the Game
function initGame() {
  loadLevel(currentLevelIndex);
  setupEventListeners();
}

// Load Level Data
function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  document.getElementById('level-number').innerText = level.levelNumber;
  document.getElementById('desired-output').innerText = level.desiredOutput;

  // Set Inputs
  inputs = level.inputs;
  renderInputs();

  // Set Available Gates
  renderGateList(level.availableGates);

  // Clear workspace
  gates = [];
  connections = [];
  outputGate = null;
  renderCanvas();
}

// Render Inputs
function renderInputs() {
  const inputsContainer = document.getElementById('inputs');
  inputsContainer.innerHTML = '';

  for (const [label, value] of Object.entries(inputs)) {
    const inputNode = document.createElement('div');
    inputNode.classList.add('input-node');

    const inputLabel = document.createElement('label');
    inputLabel.innerText = `${label}: `;
    inputNode.appendChild(inputLabel);

    const inputValue = document.createElement('span');
    inputValue.innerText = value;
    inputValue.id = `input-${label}`;
    inputNode.appendChild(inputValue);

    inputsContainer.appendChild(inputNode);
  }
}

// Render Gate List
function renderGateList(gateTypes) {
  const gateList = document.getElementById('gate-list');
  gateList.innerHTML = '';

  gateTypes.forEach(type => {
    const gateIcon = document.createElement('img');
    gateIcon.src = `assets/${type.toLowerCase()}_gate.png`; // Ensure you have gate images
    gateIcon.alt = `${type} Gate`;
    gateIcon.classList.add('gate-icon');
    gateIcon.draggable = true;
    gateIcon.dataset.gateType = type;

    // Drag Start Event
    gateIcon.addEventListener('dragstart', dragStart);

    gateList.appendChild(gateIcon);
  });
}

// Drag and Drop Handlers
function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.gateType);
}

// Canvas Drop Handler
canvas.addEventListener('dragover', (e) => {
  e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  const gateType = e.dataTransfer.getData('text/plain');
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  addGate(gateType, x, y);
});

// Add Gate to Circuit
function addGate(type, x, y) {
  const gate = new LogicGate(`gate${gates.length}`, type, x, y);
  gates.push(gate);
  renderCanvas();
}

// Logic Gate Class
class LogicGate {
  constructor(id, type, x, y) {
    this.id = id;
    this.type = type; // 'AND', 'OR', etc.
    this.inputs = [];
    this.output = null;
    this.position = { x: x, y: y };
    this.width = 60;
    this.height = 60;
    this.isOutputGate = false;
  }

  computeOutput() {
    const inputValues = this.inputs.map(conn => conn.value);
    switch (this.type) {
      case 'AND':
        this.output = inputValues.every(val => val === 1) ? 1 : 0;
        break;
      case 'OR':
        this.output = inputValues.some(val => val === 1) ? 1 : 0;
        break;
      case 'NOT':
        this.output = inputValues[0] === 1 ? 0 : 1;
        break;
      // Add other gate types as needed
    }
  }

  draw(ctx) {
    // Draw gate rectangle (simplified for demonstration)
    ctx.fillStyle = '#ddd';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#000';
    ctx.fillText(this.type, this.position.x + 10, this.position.y + 35);
  }
}

// Render Canvas
function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Gates
  gates.forEach(gate => {
    gate.draw(ctx);
  });

  // Draw Connections (if any)
  // For simplicity, this example does not implement connections
}

// Run Circuit
function runCircuit() {
  // Simplified computation without actual connections
  // In a complete game, you would process inputs through connected gates

  if (gates.length === 0) {
    alert('Place some gates on the workspace!');
    return;
  }

  // For demonstration, assume the last gate is the output gate
  outputGate = gates[gates.length - 1];
  outputGate.isOutputGate = true;

  // Assign inputs to the first gate
  const firstGate = gates[0];
  firstGate.inputs = Object.values(inputs).map(val => ({ value: val }));

  // Compute outputs sequentially
  gates.forEach(gate => {
    gate.computeOutput();
    // For simplicity, set the next gate's inputs to the current gate's output
    const nextGateIndex = gates.indexOf(gate) + 1;
    if (gates[nextGateIndex]) {
      gates[nextGateIndex].inputs = [{ value: gate.output }];
    }
  });

  // Display Output
  const finalOutput = outputGate.output;
  document.getElementById('current-output').innerText = finalOutput;

  // Check if output matches desired output
  const desiredOutput = levels[currentLevelIndex].desiredOutput;
  if (finalOutput === desiredOutput) {
    alert('Congratulations! You solved the puzzle.');
    // Proceed to next level
    currentLevelIndex++;
    if (currentLevelIndex < levels.length) {
      loadLevel(currentLevelIndex);
    } else {
      alert('You have completed all levels!');
    }
  } else {
    alert('Incorrect output. Try again.');
  }
}

// Reset Game
function resetGame() {
  gates = [];
  connections = [];
  outputGate = null;
  renderCanvas();
  document.getElementById('current-output').innerText = '0';
}

// Event Listeners
function setupEventListeners() {
  document.getElementById('run-button').addEventListener('click', runCircuit);
  document.getElementById('reset-button').addEventListener('click', resetGame);
}

// Initialize the game when the page loads
window.onload = initGame;
