class Tree {
    constructor(num_nodes) {
        this.num_nodes = num_nodes;
        this.node_values = this.generate_node_values(255, 30);
        this.height = this.get_tree_height()
        this.nodes = this.init_heap(0, 1000);
    }

    init_heap(max, min) {
        var nodes = new Array(this.num_nodes);
        var max_nodes_in_level = 1;
        var curr_nodes_in_level = 0;
        var node_x = width / 2;
        var start_x = node_x;
        var node_y = 60;
        var size = 17;
        var text_size = 12;
        var dist_between_nodes = Math.pow(2, this.height - 1) * size * 2;

        var curr_level = 0;

        for (let i = 0; i < this.num_nodes; i++) {
            let data = this.node_values[i];
            nodes[i] = new Node(data, node_x, node_y, size, text_size);
            node_x += dist_between_nodes;
            curr_nodes_in_level++;

            if (curr_nodes_in_level == max_nodes_in_level) {
                curr_level++;
                max_nodes_in_level *= 2;
                curr_nodes_in_level = 0;
                dist_between_nodes /= 2;
                node_y += 50;
                node_x = start_x - dist_between_nodes / 2;
                start_x = node_x;
            }
        }
        return nodes;
    }

    generate_node_values(max, min) {
        var values = new Array(this.node_nodes);
        for (let i = 0; i < this.num_nodes; i++) {
            values[i] = Math.floor(Math.random() * max + 1) + min;
        }
        return values;
    }

    get_tree_height() {
        return Math.ceil(Math.log2(this.num_nodes + 1) - 1);
    }

    display_tree() {
        reset_background();
        this.show_nodes();
    }

    show_nodes() {
        stroke(0, 0, 0);
        strokeWeight(1);
        var max_idx = this.num_nodes - 1;
        for (let j = 0; 2 * j + 1 <= max_idx; j++) {
            line(this.nodes[j].x, this.nodes[j].y, this.nodes[2 * j + 1].x, this.nodes[2 * j + 1].y);
        }

        for (let j = 0; 2 * j + 2 <= max_idx; j++) {
            line(this.nodes[j].x, this.nodes[j].y, this.nodes[2 * j + 2].x, this.nodes[2 * j + 2].y);
        }


        for (let i = 0; i < this.num_nodes; i++) {
            this.nodes[i].show();
        }
    }
}
