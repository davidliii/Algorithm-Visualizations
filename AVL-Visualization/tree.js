class Tree {
    constructor(num_nodes) {
        this.num_nodes = num_nodes;
        this.node_values = this.generate_node_values(0, 999); //sorted array
        this.avl = generate_avl_tree(this.node_value);
        this.nodes = this.init_nodes();
        this.edges = this.init_edges();
    }

    generate_node_values(min, max) {
        var values = new Array(this.num_nodes);
        for (let i = 0; i < this.num_nodes; i++) {
            values[i] = Math.floor(Math.random() * max + 1) + min;
        }
        values.sort(function(a, b) {return a-b});
        return values;
    }

    generate_avl_tree(values) {
        
    }
}
