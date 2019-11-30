class Graph {
    constructor(num_nodes) {
        this.max_edges = 3;
        this.num_nodes = num_nodes;
        this.node_values = this.generate_node_values();
        this.nodes = Array(0);
        this.edges = Array(0);
        this.init_node_and_edges();
    }

    generate_node_values() {
        let values = Array(0);
        for (let i = 0; i < this.num_nodes; i++) {
            values.push(i);
        }
        return values;
    }

    init_node_and_edges() {
        for (let i = 0; i < this.node_values.length; i++) { //creating nodes
            let node = new Node(this.node_values[i], this.node_values[i].toString());
            this.nodes.push(node);
        }

        for (let i = 0; i < this.nodes.length; i++) { //create edges
            let from = i;
            let to_list = Array(0);

            for (let j = 0; j < this.max_edges; j++) {
                let to = Math.floor(Math.random() * (this.num_nodes - from)) + from + 1;
                if (!to_list.includes(to)) {
                    if (to < this.nodes.length) {
                        to_list.push(to);
                        let weight = Math.floor(Math.random() * (20 - 1)) + 1;
                        let edge = new Edge(from, to, weight);
                        this.edges.push(edge);
                    }
                }
            }
        }

        let num_levels = Math.ceil(Math.sqrt(this.nodes.length));
        let nodes_per_level = Math.floor(this.nodes.length / num_levels);
        let curr_level = 1;
        for (let i = 0; i < this.nodes.length; i++) { //set node levels
            if (i > curr_level * nodes_per_level) {
                curr_level++;
            }
            this.nodes[i].level = curr_level;
        }
    }
}
