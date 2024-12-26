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

    // Graph options
    const options = {
        edges: {
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf3c5', // City Icon (Map Marker Alt)
                size: 40,
                color: 'black',
            }
        }
    };

    // Initialize networks
    const network = new vis.Network(container);
    network.setOptions(options);

    const network2 = new vis.Network(container2);
    network2.setOptions(options);

    // Create graph data
    function createData() {
        V = Math.floor(Math.random() * 18) + 3; // V between 3 and 20
        let nodes = [];
        for (let i = 1; i <= V; i++) {
            nodes.push({ id: i, label: cities[i - 1] });
        }
        nodes = new vis.DataSet(nodes);

        let edges = [];
        for (let i = 2; i <= V; i++) {
            let neigh = i - Math.floor(Math.random() * Math.min(i - 1, 3) + 1);
            edges.push({
                type: 0,
                from: i,
                to: neigh,
                color: 'orange',
                label: String(Math.floor(Math.random() * 70) + 31),
                arrows: '' // No arrows for question graph
            });
        }

        for (let i = 1; i <= V / 2;) {
            let n1 = Math.floor(Math.random() * V) + 1;
            let n2 = Math.floor(Math.random() * V) + 1;
            if (n1 !== n2) {
                let works = 0;
                for (let j = 0; j < edges.length; j++) {
                    if (edges[j]['from'] === n1 && edges[j]['to'] === n2) {
                        if (edges[j]['type'] === 0)
                            works = 1;
                        else
                            works = 2;
                    }
                }

                if (works <= 1) {
                    if (works === 0 && i < V / 4) {
                        edges.push({
                            type: 0,
                            from: n1,
                            to: n2,
                            color: 'orange',
                            label: String(Math.floor(Math.random() * 70) + 31),
                            arrows: ''
                        });
                    } else {
                        edges.push({
                            type: 1,
                            from: n1,
                            to: n2,
                            color: 'green',
                            label: String(Math.floor(Math.random() * 50) + 1),
                            arrows: ''
                        });
                    }
                    i++;
                }
            }
        }

        src = Math.floor(Math.random() * (V - 1)) + 1;
        dst = Math.floor(Math.random() * V) + 1;
        if (src === dst) dst++;

        curr_data = {
            nodes: nodes,
            edges: edges
        };
    }

    // Generate new graph
    genNew.onclick = function () {
        createData();
        network.setData(curr_data);
        temptext2.innerText = 'Find least time path from ' + cities[src - 1] + ' to ' + cities[dst - 1];
        temptext.style.display = "inline";
        temptext2.style.display = "inline";
        container2.style.display = "none";
    };

    solve.onclick = function () {
        temptext.style.display = "none";
        temptext2.style.display = "none";
        container2.style.display = "inline";
        network2.setData(solveData());
    };

    // Dijkstra Algorithm
    function djikstra(graph, sz, src) {
        let vis = Array(sz).fill(0);
        let dist = [];
        for (let i = 0; i < sz; i++)
            dist.push([10000, -1]);
        dist[src][0] = 0;

        for (let i = 0; i < sz - 1; i++) {
            let mn = -1;
            for (let j = 0; j < sz; j++) {
                if (!vis[j] && (mn === -1 || dist[j][0] < dist[mn][0]))
                    mn = j;
            }

            vis[mn] = 1;
            for (let edge of graph[mn]) {
                if (!vis[edge[0]] && dist[edge[0]][0] > dist[mn][0] + edge[1]) {
                    dist[edge[0]][0] = dist[mn][0] + edge[1];
                    dist[edge[0]][1] = mn;
                }
            }
        }

        return dist;
    }

    function createGraph(data) {
        let graph = [];
        for (let i = 0; i < V; i++) graph.push([]);

        for (let edge of data['edges']) {
            if (edge['type'] === 1) continue;
            graph[edge['to'] - 1].push([edge['from'] - 1, parseInt(edge['label'])]);
            graph[edge['from'] - 1].push([edge['to'] - 1, parseInt(edge['label'])]);
        }

        return graph;
    }

    function solveData() {
        const graph = createGraph(curr_data);

        let dist1 = djikstra(graph, V, src - 1);
        let new_edges = pushEdges(dist1, dst - 1);

        return {
            nodes: curr_data['nodes'],
            edges: new_edges
        };
    }

    function pushEdges(dist, curr) {
        let tmp_edges = [];
        while (dist[curr][0] !== 0) {
            let fm = dist[curr][1];
            tmp_edges.push({
                arrows: { to: { enabled: true } },
                from: fm + 1,
                to: curr + 1,
                color: 'orange',
                label: String(dist[curr][0] - dist[fm][0])
            });
            curr = fm;
        }
        return tmp_edges;
    }

    genNew.click();
};
