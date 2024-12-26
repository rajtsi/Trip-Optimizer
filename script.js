onload = function () {
    let curr_data, V, src, dst;

    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    const temptext2 = document.getElementById('temptext2');
    const cities = ['Delhi', 'Mumbai', 'Gujarat', 'Goa', 'Kanpur', 
        'Jammu', 'Hyderabad', 'Bangalore', 'Gangtok', 'Meghalaya',
        'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Surat',
        'Lucknow', 'Bhopal', 'Indore', 'Chandigarh', 'Agra'];

    const options = {
        edges: {
            labelHighlightBold: true,
            font: { size: 20 },
            arrows: { to: { enabled: true } }
        },
        nodes: {
            font: '12px arial red',
            scaling: { label: true },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf64f',
                size: 40,
                color: 'black',
            }
        }
    };

    const network = new vis.Network(container);
    network.setOptions(options);
    const network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData() {
        V = Math.floor(Math.random() * 18) + 3; // Ensures V is between 3 and 20
        let nodes = [];
        for (let i = 1; i <= V; i++) {
            nodes.push({ id: i, label: cities[i - 1] });
        }
        nodes = new vis.DataSet(nodes);

        let edges = [];
        for (let i = 2; i <= V; i++) {
            let neigh = i - Math.floor(Math.random() * Math.min(i - 1, 3) + 1);
            edges.push({ type: 0, from: i, to: neigh, color: 'orange', label: String(Math.floor(Math.random() * 70) + 31) });
        }

        for (let i = 1; i <= V / 2;) {
            let n1 = Math.floor(Math.random() * V) + 1;
            let n2 = Math.floor(Math.random() * V) + 1;
            if (n1 !== n2) {
                if (n1 < n2) [n1, n2] = [n2, n1];
                let exists = edges.some(e => e.from === n1 && e.to === n2);
                if (!exists) {
                    edges.push({
                        type: Math.random() > 0.5 ? 1 : 0,
                        from: n1,
                        to: n2,
                        color: Math.random() > 0.5 ? 'green' : 'orange',
                        label: String(Math.floor(Math.random() * 70) + 31)
                    });
                    i++;
                }
            }
        }

        src = Math.floor(Math.random() * V) + 1;
        dst = Math.floor(Math.random() * V) + 1;
        if (src === dst) dst = (dst % V) + 1;

        curr_data = { nodes, edges };
    }

    function buildAdjacencyList(edges) 
    {
        const graph = Array.from({ length: V }, () => []);
        edges.forEach(edge => {
            const weight = parseInt(edge.label);
            graph[edge.from - 1].push({ to: edge.to - 1, weight, type: edge.type });
            graph[edge.to - 1].push({ to: edge.from - 1, weight, type: edge.type });
        });
        return graph;
    }

    function dijkstra(graph, src) {
        const dist = Array(V).fill(Infinity);
        const parent = Array(V).fill(null);
        const pq = [{ node: src, dist: 0 }];
        dist[src] = 0;

        while (pq.length) {
            pq.sort((a, b) => a.dist - b.dist);
            const { node, dist: currDist } = pq.shift();

            graph[node].forEach(({ to, weight }) => {
                if (currDist + weight < dist[to]) {
                    dist[to] = currDist + weight;
                    parent[to] = node;
                    pq.push({ node: to, dist: dist[to] });
                }
            });
        }
        return { dist, parent };
    }

    function backtraceEdges(parent, dist, target) {
        const edges = [];
        while (parent[target] !== null) {
            const from = parent[target];
            edges.push({
                from: from + 1,
                to: target + 1,
                color: 'orange',
                label: String(dist[target] - dist[from]),
                arrows: { to: { enabled: true } }
            });
            target = from;
        }
        return edges.reverse();
    }

    genNew.onclick = function () {
        createData();
        network.setData(curr_data);
        temptext2.innerText = `Find the least time path from ${cities[src - 1]} to ${cities[dst - 1]}`;
        temptext.style.display = "inline";
        temptext2.style.display = "inline";
        container2.style.display = "none";
    };

    solve.onclick = function () {
        const graph = buildAdjacencyList(curr_data.edges);
        const { dist, parent } = dijkstra(graph, src - 1);
        const newEdges = backtraceEdges(parent, dist, dst - 1);

        const ans_data = {
            nodes: curr_data.nodes,
            edges: newEdges
        };

        temptext.style.display = "none";
        temptext2.style.display = "none";
        container2.style.display = "inline";
        network2.setData(ans_data);
    };

    genNew.click();
};
