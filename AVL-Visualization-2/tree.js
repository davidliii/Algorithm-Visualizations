class TreeValueGenerator { //this class will only be referenced to determine the
                           //values of vis dataset nodes and edges
    constructor(num_nodes) {
        this.num_nodes = num_nodes;
        this.values = this.generate_values();
        this.nodes = Array(0);
        this.edges = Array(0);

        this.create_nodes(0, this.values.length - 1);
        this.create_edges();
        console.log(this.nodes);
        console.log(this.edges);
    }

    generate_values() {
        let values = [];
        while (values.length < this.num_nodes) {
            let x = Math.floor(Math.random() * 999) + 1;
            if (values.indexOf(x) == -1) {
                values.push(x);
            }
        }
        values.sort(function sort(a, b) {return a - b});
        return values;
    }

    create_nodes(start, end) {
        if (start > end) {
            return null;
        }

        let mid = Math.floor((start + end) / 2);

        let node = new Node(this.values[mid]);

        node.left_id = this.create_nodes(start, mid - 1);
        node.right_id = this.create_nodes(mid + 1, end);

        this.nodes.push(node);
        return node.id
    }

    create_edges() {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].left_id != null) {
                let edge = new Edge(this.nodes[i].id, this.nodes[i].left_id);
                this.edges.push(edge);
            }
            if (this.nodes[i].right_id != null) {
                let edge = new Edge(this.nodes[i].id, this.nodes[i].right_id);
                this.edges.push(edge);
            }
        }
    }
}

class Node { //use this as a template for vis dataset node
    constructor(label) {
        this.id = label;
        this.label = label.toString();
        this.right_id = null;
        this.left_id = null;
    }
}

class Edge { //use this as a template for vis dataset edge
    constructor(from, to) {
        this.to = to;
        this.from = from;
    }
}
