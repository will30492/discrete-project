// script.js
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const contentDiv = document.getElementById('content');

    // Function to load content
    function loadContent(page) {
        fetch(`content/${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                contentDiv.innerHTML = html;

                // Re-render MathJax content
                if (window.MathJax) {
                    MathJax.typesetPromise([contentDiv]).then(() => {
                        initializePage(page);
                    });
                } else {
                    initializePage(page);
                }

                // Add event listeners to dynamically loaded content
                addDynamicEventListeners();
            })
            .catch(error => {
                contentDiv.innerHTML = '<p>Content not found.</p>';
                console.error('Error loading content:', error);
            });
    }

    // Event listeners for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            const page = link.getAttribute('data-page');
            loadContent(page);
        });
    });

    // Function to add event listeners to dynamically loaded content
    function addDynamicEventListeners() {
        const dynamicLinks = contentDiv.querySelectorAll('a[data-page]');
        dynamicLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                loadContent(page);
            });
        });
    }

    // Load home page by default
    loadContent('home');

    // Initialize page-specific scripts
    function initializePage(page) {
        if (page === 'game') {
            initializeGame();
        } else if (page.startsWith('tutorial')) {
            initializeTutorial(page);
        } else if (page === 'quiz') {
            initializeQuiz();
        }
    }

    // Initialize game page
    function initializeGame() {
        const addVertexBtn = document.getElementById('add-vertex');
        const addEdgeBtn = document.getElementById('add-edge');
        const resetGameBtn = document.getElementById('reset-game');
        const findEulerianBtn = document.getElementById('find-eulerian');
        const findHamiltonianBtn = document.getElementById('find-hamiltonian');
        const feedbackDiv = document.getElementById('feedback');
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        let graph = new Graph();
        let addingEdge = false;
        let selectedVertex = null;

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const pos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            if (addingEdge) {
                const vertex = graph.getVertexAt(pos);
                if (vertex) {
                    if (selectedVertex && selectedVertex !== vertex) {
                        graph.addEdge(selectedVertex, vertex);
                        addingEdge = false;
                        selectedVertex = null;
                        drawGraph();
                        feedbackDiv.textContent = 'Edge added.';
                    } else {
                        selectedVertex = vertex;
                        feedbackDiv.textContent = 'Select another vertex to connect.';
                    }
                }
            } else {
                // Optionally, select a vertex or perform other actions
            }
        });

        addVertexBtn.addEventListener('click', () => {
            const label = `V${graph.vertices.length + 1}`;
            const vertex = new Vertex(
                Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
                Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
                label
            );
            graph.addVertex(vertex);
            drawGraph();
            feedbackDiv.textContent = 'Vertex added.';
        });

        addEdgeBtn.addEventListener('click', () => {
            addingEdge = true;
            selectedVertex = null;
            feedbackDiv.textContent = 'Click two vertices to add an edge between them.';
        });

        resetGameBtn.addEventListener('click', () => {
            graph = new Graph();
            drawGraph();
            feedbackDiv.textContent = 'Graph has been reset.';
        });

        findEulerianBtn.addEventListener('click', () => {
            const path = graph.findEulerianPath();
            if (path) {
                feedbackDiv.textContent = 'Eulerian Path found!';
                animatePath(path);
            } else {
                feedbackDiv.textContent = 'No Eulerian Path exists.';
            }
        });

        findHamiltonianBtn.addEventListener('click', () => {
            const path = graph.findHamiltonianCycle();
            if (path) {
                feedbackDiv.textContent = 'Hamiltonian Cycle found!';
                animatePath(path);
            } else {
                feedbackDiv.textContent = 'No Hamiltonian Cycle exists.';
            }
        });

        function drawGraph() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            graph.draw(ctx);
        }

        function animatePath(path) {
            let index = 0;

            function animate() {
                if (index < path.length - 1) {
                    ctx.beginPath();
                    ctx.moveTo(path[index].x, path[index].y);
                    ctx.lineTo(path[index + 1].x, path[index + 1].y);
                    ctx.strokeStyle = 'yellow';
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    index++;
                    setTimeout(animate, 500);
                } else {
                    drawGraph(); // Redraw the graph after animation
                }
            }

            drawGraph();
            animate();
        }

        // Initial draw
        drawGraph();
        feedbackDiv.textContent = 'Use the controls to interact with the graph.';
    }

    // Initialize tutorial page
    function initializeTutorial(page) {
        switch (page) {
            case 'tutorial1':
                initializeTutorial1();
                break;
            case 'tutorial2':
                initializeTutorial2();
                break;
            case 'tutorial3':
                initializeTutorial3();
                break;
            case 'tutorial4':
                initializeTutorial4();
                break;
            case 'tutorial5':
                initializeTutorial5();
                break;
            case 'tutorial6':
                initializeTutorial6();
                break;
            case 'tutorial7':
                initializeTutorial7();
                break;
            case 'tutorial8':
                initializeTutorial8();
                break;
            case 'tutorial9':
                initializeTutorial9();
                break;
            default:
                break;
        }
    }

    // Initialize each tutorial

    // Tutorial 1: Introduction to Graphs
    function initializeTutorial1() {
        const createGraphButton = document.getElementById('create-graph');
        if (createGraphButton) {
            createGraphButton.addEventListener('click', () => {
                const canvas = document.getElementById('exampleCanvas');
                if (canvas) {
                    const ctx = canvas.getContext('2d');

                    // Clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Create vertices
                    const vertexA = new Vertex(150, 200, 'A');
                    const vertexB = new Vertex(300, 100, 'B');
                    const vertexC = new Vertex(450, 200, 'C');
                    const vertexD = new Vertex(300, 300, 'D');

                    // Create graph and add vertices
                    const graph = new Graph();
                    graph.addVertex(vertexA);
                    graph.addVertex(vertexB);
                    graph.addVertex(vertexC);
                    graph.addVertex(vertexD);

                    // Add edges
                    graph.addEdge(vertexA, vertexB);
                    graph.addEdge(vertexB, vertexC);
                    graph.addEdge(vertexC, vertexD);
                    graph.addEdge(vertexD, vertexA);
                    graph.addEdge(vertexA, vertexC);

                    // Draw graph
                    graph.draw(ctx);
                }
            });
        }
    }

    // Tutorial 2: Types of Graphs
    function initializeTutorial2() {
        if (document.getElementById('create-undirected')) {
            const canvas = document.getElementById('graphCanvas');
            const ctx = canvas.getContext('2d');

            function clearCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            document.getElementById('create-undirected').addEventListener('click', () => {
                clearCanvas();
                const graph = new Graph(false); // Undirected graph
                const v1 = new Vertex(200, 200, 'V1');
                const v2 = new Vertex(400, 200, 'V2');
                graph.addVertex(v1);
                graph.addVertex(v2);
                graph.addEdge(v1, v2);
                graph.draw(ctx);
            });

            document.getElementById('create-directed').addEventListener('click', () => {
                clearCanvas();
                const graph = new Graph(true); // Directed graph
                const v1 = new Vertex(200, 200, 'V1');
                const v2 = new Vertex(400, 200, 'V2');
                graph.addVertex(v1);
                graph.addVertex(v2);
                graph.addEdge(v1, v2);
                graph.draw(ctx);
            });

            document.getElementById('create-weighted').addEventListener('click', () => {
                clearCanvas();
                const graph = new Graph(false, true); // Weighted graph
                const v1 = new Vertex(200, 200, 'V1');
                const v2 = new Vertex(400, 200, 'V2');
                graph.addVertex(v1);
                graph.addVertex(v2);
                graph.addEdge(v1, v2, 10); // Edge with weight 10
                graph.draw(ctx);
            });
        }
    }

    // Tutorial 3: Graph Representations
    function initializeTutorial3() {
        if (document.getElementById('visualize-representation')) {
            const representationSelect = document.getElementById('representation-select');
            const outputDiv = document.getElementById('representation-output');

            document.getElementById('visualize-representation').addEventListener('click', () => {
                const representation = representationSelect.value;
                outputDiv.innerHTML = ''; // Clear previous output

                // Create a sample graph
                const graph = new Graph(false);
                const vA = new Vertex(0, 0, 'A');
                const vB = new Vertex(0, 0, 'B');
                const vC = new Vertex(0, 0, 'C');
                graph.addVertex(vA);
                graph.addVertex(vB);
                graph.addVertex(vC);
                graph.addEdge(vA, vB);
                graph.addEdge(vB, vC);

                if (representation === 'adjacency-matrix') {
                    const matrix = getAdjacencyMatrix(graph);
                    outputDiv.innerHTML = '<h4>Adjacency Matrix</h4>' + matrixToHTML(matrix);
                } else if (representation === 'adjacency-list') {
                    const list = getAdjacencyList(graph);
                    outputDiv.innerHTML = '<h4>Adjacency List</h4>' + listToHTML(list);
                } else if (representation === 'incidence-matrix') {
                    const matrix = getIncidenceMatrix(graph);
                    outputDiv.innerHTML = '<h4>Incidence Matrix</h4>' + matrixToHTML(matrix);
                }
            });

            // Functions to generate representations
            function getAdjacencyMatrix(graph) {
                const size = graph.vertices.length;
                const matrix = Array.from({ length: size }, () => Array(size).fill(0));

                graph.vertices.forEach((vertex, i) => {
                    vertex.edges.forEach(edge => {
                        const j = graph.vertices.indexOf(edge.vertex);
                        matrix[i][j] = 1;
                    });
                });

                return matrix;
            }

            function getAdjacencyList(graph) {
                const list = {};
                graph.vertices.forEach(vertex => {
                    list[vertex.label] = vertex.edges.map(edge => edge.vertex.label);
                });
                return list;
            }

            function getIncidenceMatrix(graph) {
                const numVertices = graph.vertices.length;
                const edges = [];

                graph.vertices.forEach(vertex => {
                    vertex.edges.forEach(edge => {
                        if (!graph.directed) {
                            if (!edges.some(e => (e.from === edge.vertex && e.to === vertex))) {
                                edges.push({ from: vertex, to: edge.vertex });
                            }
                        } else {
                            edges.push({ from: vertex, to: edge.vertex });
                        }
                    });
                });

                const matrix = Array.from({ length: numVertices }, () => Array(edges.length).fill(0));

                edges.forEach((edge, index) => {
                    const fromIndex = graph.vertices.indexOf(edge.from);
                    const toIndex = graph.vertices.indexOf(edge.to);
                    matrix[fromIndex][index] = 1;
                    if (!graph.directed) {
                        matrix[toIndex][index] = 1;
                    } else {
                        matrix[toIndex][index] = -1;
                    }
                });

                return matrix;
            }

            function matrixToHTML(matrix) {
                let html = '<table border="1">';
                for (let row of matrix) {
                    html += '<tr>';
                    for (let cell of row) {
                        html += `<td>${cell}</td>`;
                    }
                    html += '</tr>';
                }
                html += '</table>';
                return html;
            }

            function listToHTML(list) {
                let html = '<ul>';
                for (let [vertex, neighbors] of Object.entries(list)) {
                    html += `<li>${vertex}: [${neighbors.join(', ')}]</li>`;
                }
                html += '</ul>';
                return html;
            }
        }
    }

    // Tutorial 4: Graph Traversals
    function initializeTutorial4() {
        // BFS
        if (document.getElementById('start-bfs')) {
            document.getElementById('start-bfs').addEventListener('click', () => {
                const canvas = document.getElementById('bfsCanvas');
                const ctx = canvas.getContext('2d');

                // Initialize graph
                const graph = createTraversalGraph();

                // Draw graph
                graph.draw(ctx);

                // BFS Visualization
                const visited = new Set();
                const queue = [];
                queue.push(graph.vertices[0]);
                visited.add(graph.vertices[0]);

                function bfsStep() {
                    if (queue.length > 0) {
                        const vertex = queue.shift();

                        // Highlight current vertex
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        graph.draw(ctx);
                        vertex.draw(ctx, '#2ecc71'); // Green color

                        for (let edge of vertex.edges) {
                            if (!visited.has(edge.vertex)) {
                                visited.add(edge.vertex);
                                queue.push(edge.vertex);
                            }
                        }

                        setTimeout(bfsStep, 1000);
                    } else {
                        // Traversal complete
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        graph.draw(ctx);
                    }
                }

                bfsStep();
            });
        }

        // DFS
        if (document.getElementById('start-dfs')) {
            document.getElementById('start-dfs').addEventListener('click', () => {
                const canvas = document.getElementById('dfsCanvas');
                const ctx = canvas.getContext('2d');

                // Initialize graph
                const graph = createTraversalGraph();

                // Draw graph
                graph.draw(ctx);

                // DFS Visualization
                const visited = new Set();
                const stack = [];
                stack.push(graph.vertices[0]);

                function dfsStep() {
                    if (stack.length > 0) {
                        const vertex = stack.pop();

                        if (!visited.has(vertex)) {
                            visited.add(vertex);

                            // Highlight current vertex
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            graph.draw(ctx);
                            vertex.draw(ctx, '#e67e22'); // Orange color

                            for (let edge of vertex.edges) {
                                if (!visited.has(edge.vertex)) {
                                    stack.push(edge.vertex);
                                }
                            }

                            setTimeout(dfsStep, 1000);
                        } else {
                            dfsStep();
                        }
                    } else {
                        // Traversal complete
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        graph.draw(ctx);
                    }
                }

                dfsStep();
            });
        }

        function createTraversalGraph() {
            const graph = new Graph();
            const vA = new Vertex(300, 100, 'A');
            const vB = new Vertex(150, 200, 'B');
            const vC = new Vertex(450, 200, 'C');
            const vD = new Vertex(300, 300, 'D');
            const vE = new Vertex(150, 400, 'E');
            const vF = new Vertex(450, 400, 'F');

            graph.addVertex(vA);
            graph.addVertex(vB);
            graph.addVertex(vC);
            graph.addVertex(vD);
            graph.addVertex(vE);
            graph.addVertex(vF);

            graph.addEdge(vA, vB);
            graph.addEdge(vA, vC);
            graph.addEdge(vB, vD);
            graph.addEdge(vC, vD);
            graph.addEdge(vD, vE);
            graph.addEdge(vD, vF);

            return graph;
        }
    }

    // Tutorial 5: Shortest Path Algorithms
    function initializeTutorial5() {
        if (document.getElementById('run-dijkstra')) {
            document.getElementById('run-dijkstra').addEventListener('click', () => {
                const canvas = document.getElementById('dijkstraCanvas');
                const ctx = canvas.getContext('2d');

                // Initialize graph
                const graph = new Graph(false, true);
                const vA = new Vertex(100, 300, 'A');
                const vB = new Vertex(200, 100, 'B');
                const vC = new Vertex(400, 100, 'C');
                const vD = new Vertex(500, 300, 'D');
                const vE = new Vertex(300, 400, 'E');

                graph.addVertex(vA);
                graph.addVertex(vB);
                graph.addVertex(vC);
                graph.addVertex(vD);
                graph.addVertex(vE);

                graph.addEdge(vA, vB, 2);
                graph.addEdge(vA, vE, 5);
                graph.addEdge(vB, vC, 3);
                graph.addEdge(vB, vE, 2);
                graph.addEdge(vC, vD, 2);
                graph.addEdge(vD, vE, 3);

                // Draw graph
                graph.draw(ctx);

                // Dijkstra's Algorithm Visualization
                const result = graph.dijkstra(vA);
                const { distances, previous } = result;

                // Highlight shortest paths
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                graph.draw(ctx);

                graph.vertices.forEach(vertex => {
                    const distance = distances.get(vertex);
                    ctx.fillStyle = '#000';
                    ctx.font = '12px Arial';
                    ctx.fillText(`Dist: ${distance}`, vertex.x + 20, vertex.y);
                });
            });
        }
    }

    // Tutorial 6: Eulerian and Hamiltonian Paths
    function initializeTutorial6() {
        if (document.getElementById('find-eulerian-tutorial')) {
            document.getElementById('find-eulerian-tutorial').addEventListener('click', () => {
                const canvas = document.getElementById('eulerianCanvas');
                const ctx = canvas.getContext('2d');

                // Create graph
                const graph = new Graph();
                const v1 = new Vertex(150, 200, '1');
                const v2 = new Vertex(300, 100, '2');
                const v3 = new Vertex(450, 200, '3');
                const v4 = new Vertex(300, 300, '4');

                graph.addVertex(v1);
                graph.addVertex(v2);
                graph.addVertex(v3);
                graph.addVertex(v4);

                graph.addEdge(v1, v2);
                graph.addEdge(v2, v3);
                graph.addEdge(v3, v4);
                graph.addEdge(v4, v1);
                graph.addEdge(v1, v3);

                // Draw graph
                graph.draw(ctx);

                // Find Eulerian Path
                const path = graph.findEulerianPath();

                if (path) {
                    // Animate path
                    let index = 0;

                    function animate() {
                        if (index < path.length - 1) {
                            ctx.beginPath();
                            ctx.moveTo(path[index].x, path[index].y);
                            ctx.lineTo(path[index + 1].x, path[index + 1].y);
                            ctx.strokeStyle = 'yellow';
                            ctx.lineWidth = 4;
                            ctx.stroke();
                            index++;
                            setTimeout(animate, 500);
                        } else {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            graph.draw(ctx);
                        }
                    }

                    animate();
                } else {
                    alert('No Eulerian Path exists.');
                }
            });
        }

        if (document.getElementById('find-hamiltonian-tutorial')) {
            document.getElementById('find-hamiltonian-tutorial').addEventListener('click', () => {
                const canvas = document.getElementById('hamiltonianCanvas');
                const ctx = canvas.getContext('2d');

                // Create graph
                const graph = new Graph();
                const v1 = new Vertex(150, 200, '1');
                const v2 = new Vertex(300, 100, '2');
                const v3 = new Vertex(450, 200, '3');
                const v4 = new Vertex(300, 300, '4');
                const v5 = new Vertex(300, 200, '5');

                graph.addVertex(v1);
                graph.addVertex(v2);
                graph.addVertex(v3);
                graph.addVertex(v4);
                graph.addVertex(v5);

                graph.addEdge(v1, v2);
                graph.addEdge(v2, v3);
                graph.addEdge(v3, v4);
                graph.addEdge(v4, v1);
                graph.addEdge(v1, v5);
                graph.addEdge(v5, v3);

                // Draw graph
                graph.draw(ctx);

                // Find Hamiltonian Cycle
                const path = graph.findHamiltonianCycle();

                if (path) {
                    // Animate path
                    let index = 0;

                    function animate() {
                        if (index < path.length - 1) {
                            ctx.beginPath();
                            ctx.moveTo(path[index].x, path[index].y);
                            ctx.lineTo(path[index + 1].x, path[index + 1].y);
                            ctx.strokeStyle = 'yellow';
                            ctx.lineWidth = 4;
                            ctx.stroke();
                            index++;
                            setTimeout(animate, 500);
                        } else {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            graph.draw(ctx);
                        }
                    }

                    animate();
                } else {
                    alert('No Hamiltonian Cycle exists.');
                }
            });
        }
    }


// Initialize Quiz
function initializeQuiz() {
    const questions = [
      {
        question: "What is the degree of a vertex?",
        options: [
          "Number of vertices in the graph",
          "Number of edges incident to the vertex",
          "Number of cycles in the graph",
          "The weight of the vertex",
        ],
        answer: 1,
      },
      {
        question: "Which of the following graphs is non-planar?",
        options: [
          "Complete Graph K4",
          "Complete Bipartite Graph K3,3",
          "Cycle Graph C5",
          "Path Graph P4",
        ],
        answer: 1,
      },
      {
        question:
          "What is the chromatic number of a complete graph with n vertices?",
        options: ["n", "n-1", "2", "1"],
        answer: 0,
      },
      {
        question: "Prim's algorithm is used for:",
        options: [
          "Finding the shortest path between two nodes",
          "Performing a depth-first traversal",
          "Finding the minimum spanning tree of a graph",
          "Detecting cycles in a graph",
        ],
        answer: 2,
      },
      {
        question: "In a directed acyclic graph (DAG), you can perform:",
        options: [
          "Topological Sorting",
          "Finding Eulerian Cycles",
          "Detecting Negative Cycles",
          "None of the above",
        ],
        answer: 0,
      },
      {
        question:
          "Which graph traversal algorithm can be used to detect cycles in an undirected graph?",
        options: [
          "Depth-First Search",
          "Breadth-First Search",
          "Dijkstra's Algorithm",
          "Both A and B",
        ],
        answer: 3,
      },
      {
        question: "A graph is called bipartite if:",
        options: [
          "It can be divided into two disjoint sets of vertices such that every edge connects a vertex from one set to the other.",
          "It contains an even number of vertices.",
          "It has a cycle of even length.",
          "It is a tree.",
        ],
        answer: 0,
      },
      {
        question: "Kruskal's algorithm is used to:",
        options: [
          "Find the shortest path between nodes",
          "Perform topological sorting",
          "Find the minimum spanning tree of a graph",
          "Detect cycles in a graph",
        ],
        answer: 2,
      },
      {
        question:
          "In a weighted graph, the shortest path between two vertices is determined by:",
        options: [
          "The number of edges in the path",
          "The total weight of the edges in the path",
          "The degree of the vertices",
          "None of the above",
        ],
        answer: 1,
      },
      {
        question: "Which of the following is true about trees?",
        options: [
          "A tree is a connected graph with no cycles.",
          "A tree is a disconnected graph with cycles.",
          "Every connected graph is a tree.",
          "A tree must have at least one cycle.",
        ],
        answer: 0,
      },
      {
        question: "The number of edges in a complete graph of n vertices is:",
        options: ["n", "n-1", "n(n-1)/2", "n(n+1)/2"],
        answer: 2,
      },
    ];

    let currentQuestion = 0;

    function loadQuestion() {
        const q = questions[currentQuestion];
        document.getElementById('question').textContent = q.question;
        const optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = '';
        q.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(index));
            optionsDiv.appendChild(button);
        });
    }

    function checkAnswer(selected) {
        const q = questions[currentQuestion];
        const feedbackDiv = document.getElementById('quiz-feedback');
        if (selected === q.answer) {
            feedbackDiv.textContent = 'Correct!';
        } else {
            feedbackDiv.textContent = 'Incorrect. The correct answer is: ' + q.options[q.answer];
        }
    }

    document.getElementById('next-question').addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            currentQuestion = 0; // Reset to the first question or you can show a completion message
        }
        loadQuestion();
        document.getElementById('quiz-feedback').textContent = '';
    });

    loadQuestion();
}

// Expose loadContent to window so it can be called from dynamically loaded content
window.loadContent = loadContent;
});