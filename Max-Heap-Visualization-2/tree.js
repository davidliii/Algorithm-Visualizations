class Tree {
    constructor(num_nodes) {
        this.num_nodes = num_nodes;
        this.node_values = this.generate_node_values(0, 100);
        this.nodes = this.init_nodes();
        this.edges = this.init_edges();
    }

    generate_node_values(min, max) {
        var values = new Array(this.node_nodes);
        for (let i = 0; i < this.num_nodes; i++) {
            values[i] = Math.floor(Math.random() * max + 1) + min;
        }

        for (let i = Math.floor(values.length / 2) - 1; i >= 0; i--) {
            this.heapify_array(values, i);
        }

        return values;
    }

    heapify_array(values, curr_idx) {
        let left_idx = 2 * curr_idx + 1;
        let right_idx = 2 * curr_idx + 2;

        let max_idx = curr_idx;

        if (left_idx < values.length && values[left_idx] > values[max_idx]) {
            max_idx = left_idx;
        }

        if (right_idx < values.length && values[right_idx] > values[max_idx]) {
            max_idx = right_idx;
        }

        if (max_idx != curr_idx) {
            let temp = values[max_idx];
            values[max_idx] = values[curr_idx];
            values[curr_idx] = temp;
            this.heapify_array(values, max_idx);
        }
    }

    init_nodes() {
        let nodes = [];
        for (let i = 0; i < this.num_nodes; i++) {
            nodes[i] = new Node(i, this.node_values[i].toString());
        }

        return nodes;
    }

    init_edges() {
        let edges = [];

        for (let i = 0, j = 0; i < (this.num_nodes - 1) / 2; i++) {
            edges[j] = new Edge(i, 2 * i + 1);
            edges[j+1] = new Edge(i, 2 * i + 2);
            j += 2;
        }
        return edges;

    }
}
