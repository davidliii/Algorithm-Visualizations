class Tree { //use for network representation
    constructor(num_nodes) {
        this.num_nodes = num_nodes;
        this.node_values = this.generate_node_values(0, 999); //sorted array
        this.nodes = new Array(0);
        this.edges = new Array(0);

        this.bst_root = this.array_to_bst(this.node_values, 0, this.node_values.length - 1);
        //calculate balance factor
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].balance = this.calculate_balance(this.nodes[i]);
            this.nodes[i].set_color();
        }
    }

    generate_node_values(min, max) {
        var values = new Array(this.num_nodes);
        for (let i = 0; i < this.num_nodes; i++) {
            values[i] = Math.floor(Math.random() * max + 1) + min;
        }
        values.sort(function(a, b) {return a-b});
        return values;
    }

    array_to_bst(values, start, end) {
        if (start > end) {
            return null;
        }

        let mid  = Math.floor((start + end) / 2);
        let root = new Node(mid, values[mid].toString());
        root.right = this.array_to_bst(values, start, mid - 1);
        root.left = this.array_to_bst(values, mid + 1, end);
        this.nodes.push(root);
        if (root.right != null) {
            let edge1 = new Edge(root.id, root.right.id);
            this.edges.push(edge1);
        }

        if (root.left != null) {
            let edge2 = new Edge(root.id, root.left.id);
            this.edges.push(edge2);
        }
        return root;
    }

    calculate_balance(node) {

    }
}
