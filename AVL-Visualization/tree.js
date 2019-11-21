class Tree {
    constructor(num_nodes) {
        this.num_nodes = num_nodes;
        this.node_values = this.generate_node_values(0, 999);
        this.nodes = this.init_nodes();
        this.edges = this.init_edges();
    }

    generate_nodeValues(min, max) {
        var values = new Array(this.node_nodes);
        for (let i = 0; i < this.num_nodes; i++) {
            values[i] = Math.floor(Math.random() * max + 1) + min;
        }

        make_avl(array);
        return array;
    }

    make_avl(array) {

    }

    init_nodes() { // creates list of nodes
        let nodes = [];
        for (let i = 0; i < this.num_nodes; i++) {
            nodes[i] = new Node(i, this.node_values[i].toString());
        }

        return nodes;
    }

    init_edges() { // creates list of edges
        let edges = [];

        for (let i = 0, j = 0; i < (this.num_nodes - 1) / 2; i++) {
            edges[j] = new Edge(i, 2 * i + 1);
            edges[j+1] = new Edge(i, 2 * i + 2);
            j += 2;
        }
        return edges;
    }
}
