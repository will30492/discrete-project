class Vertex {
    constructor(x, y, label = '') {
        this.x = x;
        this.y = y;
        this.label = label;
        this.edges = [];
    }

    draw(ctx, color = '#e74c3c', fill = true) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = fill ? color : '#fff';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();

        if (this.label) {
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.label, this.x, this.y + 4);
        }
    }
}

class Graph {
    constructor(directed = false, weighted = false) {
        this.vertices = [];
        this.directed = directed;
        this.weighted = weighted;
    }

    addVertex(vertex) {
        this.vertices.push(vertex);
    }

    addEdge(v1, v2, weight = 1) {
        v1.edges.push({ vertex: v2, weight: weight });
        if (!this.directed) {
            v2.edges.push({ vertex: v1, weight: weight });
        }
    }

    getVertexAt(pos) {
        for (let vertex of this.vertices) {
            const dx = vertex.x - pos.x;
            const dy = vertex.y - pos.y;
            if (Math.sqrt(dx * dx + dy * dy) < 15) {
                return vertex;
            }
        }
        return null;
    }

    draw(ctx) {
        // Draw edges
        ctx.lineWidth = 2;
        for (let vertex of this.vertices) {
            for (let edge of vertex.edges) {
                const neighbor = edge.vertex;
                const weight = edge.weight;

                ctx.beginPath();
                ctx.moveTo(vertex.x, vertex.y);
                ctx.lineTo(neighbor.x, neighbor.y);
                ctx.strokeStyle = '#3498db';
                ctx.stroke();

                // Draw arrowhead for directed edges NOT WORKING FOR SOME REASON FIX LATER
                if (this.directed) {
                    this.drawArrowhead(ctx, vertex, neighbor);
                }

                // Display weights for weighted graphs 
                if (this.weighted) {
                    const midX = (vertex.x + neighbor.x) / 2;
                    const midY = (vertex.y + neighbor.y) / 2;
                    ctx.fillStyle = '#000';
                    ctx.font = '12px Arial';
                    ctx.fillText(weight, midX, midY - 5);
                }
            }
        }
        // Draw vertices
        for (let vertex of this.vertices) {
            vertex.draw(ctx);
        }
    }

    drawArrowhead(ctx, from, to) {
        const headlen = 10; // length of head in pixels
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const endX = to.x;
        const endY = to.y;

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headlen * Math.cos(angle - Math.PI / 6),
            endY - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headlen * Math.cos(angle + Math.PI / 6),
            endY - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.strokeStyle = '#3498db';
        ctx.stroke();
    }

    // Breadth-First Search https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/
    bfs(startVertex, visitCallback) {
        const visited = new Set();
        const queue = [startVertex];
        visited.add(startVertex);

        while (queue.length > 0) {
            const vertex = queue.shift();
            visitCallback(vertex);

            for (let edge of vertex.edges) {
                if (!visited.has(edge.vertex)) {
                    visited.add(edge.vertex);
                    queue.push(edge.vertex);
                }
            }
        }
    }

    // Depth-First Search https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/
    dfs(startVertex, visitCallback) {
        const visited = new Set();

        const dfsRecursive = (vertex) => {
            visited.add(vertex);
            visitCallback(vertex);

            for (let edge of vertex.edges) {
                if (!visited.has(edge.vertex)) {
                    dfsRecursive(edge.vertex);
                }
            }
        };

        dfsRecursive(startVertex);
    }

    // Dijkstra's Algorithm https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
    dijkstra(startVertex) {
        const distances = new Map();
        const previous = new Map();
        const vertices = new Set(this.vertices);

        for (let vertex of vertices) {
            distances.set(vertex, Infinity);
            previous.set(vertex, null);
        }
        distances.set(startVertex, 0);

        while (vertices.size > 0) {
            // Get the vertex with the smallest distance
            let minVertex = null;
            for (let vertex of vertices) {
                if (minVertex === null || distances.get(vertex) < distances.get(minVertex)) {
                    minVertex = vertex;
                }
            }

            vertices.delete(minVertex);

            for (let edge of minVertex.edges) {
                const alt = distances.get(minVertex) + edge.weight;
                if (alt < distances.get(edge.vertex)) {
                    distances.set(edge.vertex, alt);
                    previous.set(edge.vertex, minVertex);
                }
            }
        }

        return { distances, previous };
    }

    // Find Eulerian Path using Hierholzer's Algorithm SOURCE: https://www.geeksforgeeks.org/hierholzers-algorithm-directed-graph/
    findEulerianPath() {
        // Check if the graph has an Eulerian path
        const oddVertices = this.vertices.filter(v => v.edges.length % 2 !== 0);
        if (oddVertices.length !== 0 && oddVertices.length !== 2) {
            return null; // No Eulerian Path exists
        }

        const stack = [];
        const path = [];
        const graphCopy = new Map();

        // Copy the edges
        this.vertices.forEach(vertex => {
            graphCopy.set(vertex, vertex.edges.slice());
        });

        const startVertex = oddVertices.length === 2 ? oddVertices[0] : this.vertices[0];
        stack.push(startVertex);

        while (stack.length > 0) {
            const vertex = stack[stack.length - 1];
            const edges = graphCopy.get(vertex);

            if (edges.length > 0) {
                const edge = edges.pop();
                // Remove the edge in the opposite direction if the graph is undirected
                if (!this.directed) {
                    const neighborEdges = graphCopy.get(edge.vertex);
                    const index = neighborEdges.findIndex(e => e.vertex === vertex);
                    if (index !== -1) {
                        neighborEdges.splice(index, 1);
                    }
                }
                stack.push(edge.vertex);
            } else {
                path.push(stack.pop());
            }
        }

        return path.reverse();
    }

    // Find Hamiltonian Cycle using Backtracking SOURCE: www.geeksforgeeks.org/hamiltonian-cycle/.
    findHamiltonianCycle() {
        const path = [];
        const visited = new Set();

        const dfs = (vertex) => {
            path.push(vertex);
            visited.add(vertex);

            if (path.length === this.vertices.length) {
                // Check if there is an edge back to the start vertex
                if (vertex.edges.some(edge => edge.vertex === path[0])) {
                    path.push(path[0]);
                    return true;
                } else {
                    visited.delete(vertex);
                    path.pop();
                    return false;
                }
            }

            for (let edge of vertex.edges) {
                if (!visited.has(edge.vertex)) {
                    if (dfs(edge.vertex)) {
                        return true;
                    }
                }
            }

            visited.delete(vertex);
            path.pop();
            return false;
        };

        for (let vertex of this.vertices) {
            if (dfs(vertex)) {
                return path;
            }
        }

        return null; // No Hamiltonian Cycle exists
    }


}