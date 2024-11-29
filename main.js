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
let isDraggingGate = false;
let selectedGate = null;
let isConnecting = false;
let connectionStart = null;
let mouseX = 0;
let mouseY = 0;
let offsetX = 0;
let offsetY = 0;

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

    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.checked = value === 1;
    inputCheckbox.dataset.inputLabel = label;
    inputCheckbox.addEventListener('change', updateInputValue);
    inputNode.appendChild(inputCheckbox);

    inputsContainer.appendChild(inputNode);
  }
}

// Update Input Value
function updateInputValue(e) {
  const label = e.target.dataset.inputLabel;
  inputs[label] = e.target.checked ? 1 : 0;
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

// Canvas Event Handlers
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
    this.inputPositions = [];
    this.outputPosition = {};
    this.updateIOPositions();
  }

  computeOutput() {
    const inputValues = this.inputs.map(inputNode => inputNode.value);
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

  updateIOPositions() {
    const x = this.position.x;
    const y = this.position.y;
    const w = this.width;
    const h = this.height;

    // Input positions
    if (this.type === 'NOT') {
      this.inputPositions = [{ x: x, y: y + h / 2 }];
    } else {
      this.inputPositions = [
        { x: x, y: y + h / 3 },
        { x: x, y: y + (2 * h) / 3 },
      ];
    }

    // Output position
    this.outputPosition = { x: x + w, y: y + h / 2 };
  }

  draw(ctx) {
    // Draw gate rectangle (simplified)
    ctx.fillStyle = '#ddd';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(this.type, this.position.x + 10, this.position.y + 35);

    // Draw input circles
    ctx.fillStyle = '#000';
    this.inputPositions.forEach(pos => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw output circle
    ctx.beginPath();
    ctx.arc(this.outputPosition.x, this.outputPosition.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  isPointInside(x, y) {
    return (
      x >= this.position.x &&
      x <= this.position.x + this.width &&
      y >= this.position.y &&
      y <= this.position.y + this.height
    );
  }
}

// Render Canvas
function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Gates
  gates.forEach(gate => {
    gate.draw(ctx);
  });

  // Draw Inputs
  let inputIndex = 0;
  for (const [label, value] of Object.entries(inputs)) {
    const x = 50;
    const y = 100 + inputIndex * 100;
    ctx.fillStyle = '#000';
    ctx.fillText(`${label}: ${value}`, x - 30, y + 5);

    // Draw input circle
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Store position for connections
    inputs[label].position = { x: x, y: y };
    inputIndex++;
  }

  // Draw Connections
  connections.forEach(conn => {
    ctx.beginPath();
    ctx.moveTo(conn.from.x, conn.from.y);
    ctx.lineTo(conn.to.x, conn.to.y);
    ctx.strokeStyle = '#000';
    ctx.stroke();
  });

  // If connecting, draw line
  if (isConnecting && connectionStart) {
    ctx.beginPath();
    ctx.moveTo(connectionStart.x, connectionStart.y);
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = '#f00';
    ctx.stroke();
  }
}

// Canvas Mouse Events
canvas.addEventListener('mousedown', (e) => {
  const { x, y } = getMousePos(e);
  selectedGate = getGateAtPosition(x, y);
  if (selectedGate) {
    isDraggingGate = true;
    offsetX = x - selectedGate.position.x;
    offsetY = y - selectedGate.position.y;
  } else {
    const inputNode = getInputAtPosition(x, y);
    const gateInput = getGateInputAtPosition(x, y);
    const gateOutput = getGateOutputAtPosition(x, y);

    if (inputNode || gateOutput) {
      isConnecting = true;
      connectionStart = { x: x, y: y, node: inputNode || gateOutput };
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  const { x, y } = getMousePos(e);
  mouseX = x;
  mouseY = y;

  if (isDraggingGate && selectedGate) {
    selectedGate.position.x = x - offsetX;
    selectedGate.position.y = y - offsetY;
    selectedGate.updateIOPositions();
    renderCanvas();
  } else if (isConnecting) {
    renderCanvas();
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (isDraggingGate) {
    isDraggingGate = false;
    selectedGate = null;
  } else if (isConnecting) {
    const { x, y } = getMousePos(e);
    const gateInput = getGateInputAtPosition(x, y);

    if (gateInput && connectionStart.node !== gateInput) {
      // Create Connection
      connections.push({
        from: connectionStart.node,
        to: gateInput,
      });

      // Update Gate Inputs
      if (!gateInput.gate.inputs.includes(connectionStart.node)) {
        gateInput.gate.inputs.push(connectionStart.node);
      }
    }
    isConnecting = false;
    connectionStart = null;
    renderCanvas();
  }
});

// Utility Functions
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function getGateAtPosition(x, y) {
  return gates.find(gate => gate.isPointInside(x, y));
}

function getInputAtPosition(x, y) {
  let inputNode = null;
  let inputIndex = 0;
  for (const [label, value] of Object.entries(inputs)) {
    const pos = {
      x: 50,
      y: 100 + inputIndex * 100,
    };
    const dx = x - pos.x;
    const dy = y - pos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 10) {
      inputNode = {
        label: label,
        x: pos.x,
        y: pos.y,
      };
      break;
    }
    inputIndex++;
  }
  return inputNode;
}

function getGateInputAtPosition(x, y) {
  for (const gate of gates) {
    for (const pos of gate.inputPositions) {
      const dx = x - pos.x;
      const dy = y - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        return { gate: gate, x: pos.x, y: pos.y };
      }
    }
  }
  return null;
}

function getGateOutputAtPosition(x, y) {
  for (const gate of gates) {
    const pos = gate.outputPosition;
    const dx = x - pos.x;
    const dy = y - pos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 10) {
      return { gate: gate, x: pos.x, y: pos.y };
    }
  }
  return null;
}

// Evaluate Circuit
function evaluateCircuit() {
  // Reset gate outputs
  gates.forEach(gate => {
    gate.output = null;
  });

  // Evaluate all gates
  let success = true;
  try {
    gates.forEach(gate => {
      evaluateGate(gate);
    });
  } catch (e) {
    success = false;
  }

  // Assume the last gate added is the output gate
  outputGate = gates[gates.length - 1];

  // Return true if the circuit was successfully evaluated
  return success;
}

function evaluateGate(gate) {
  // If the gate's output is already computed, return it
  if (gate.output !== null) {
    return gate.output;
  }

  // Evaluate inputs
  const inputValues = gate.inputs.map(inputNode => {
    if (inputNode.label) {
      // It's an input
      const value = inputs[inputNode.label];
      if (value === undefined) {
        throw new Error(`Input ${inputNode.label} is undefined`);
      }
      return value;
    } else if (inputNode.gate) {
      // It's a gate output
      return evaluateGate(inputNode.gate);
    } else {
      throw new Error('Invalid input node');
    }
  });

  // Set the gate's input values
  gate.inputs = inputValues.map(val => ({ value: val }));

  // Compute the gate's output
  gate.computeOutput();

  return gate.output;
}

// Run Circuit
function runCircuit() {
  // Reset gate outputs
  gates.forEach(gate => {
    gate.output = null;
  });

  // Evaluate Circuit
  const success = evaluateCircuit();
  const finalOutput = outputGate ? outputGate.output : null;
  document.getElementById('current-output').innerText = finalOutput !== null ? finalOutput : 'N/A';

  // Check if output matches desired output
  const desiredOutput = levels[currentLevelIndex].desiredOutput;
  if (finalOutput === desiredOutput && success) {
    alert('Congratulations! You solved the puzzle.');
    // Proceed to next level
    currentLevelIndex++;
    if (currentLevelIndex < levels.length) {
      loadLevel(currentLevelIndex);
    } else {
      alert('You have completed all levels!');
    }
  } else {
    alert('Incorrect output or incomplete circuit. Try again.');
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
