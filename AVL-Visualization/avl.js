let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let tree = null;
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset

let animationTime = 500;
let node_id_tracker = 0;

let search_found = false;
let insert_loc_found = false;

function setup() {
    canvas = createCanvas(width, height);

    node_count = createInput(); //user input for number of nodes
    node_count.size(45, 15);
    node_count.position(30, 20);

    build_tree = createButton("Build AVL Tree"); //button to initialize tree
    build_tree.position(30, 45);
    build_tree.style('font-size: 12px; background-color: #d9e6f2');
    build_tree.mousePressed(create_tree);

    delete_button = createButton("Delete Selected Node"); //button to delete a node
    delete_button.position(30, 70);
    delete_button.style('font-size: 12px; background-color: #d9e6f2');
    delete_button.mousePressed(delete_node);

    insert_button = createButton("Insert Node"); //button to insert a node
    insert_button.position(30, 95);
    insert_button.style('font-size: 12px; background-color: #d9e6f2');
    insert_button.mousePressed(insert_node);

    insert_input = createInput();
    insert_input.size(32, 13);
    insert_input.position(120, 96);

    search_button = createButton("Search for Key"); //button to reorganize heap
    search_button.position(30, 120);
    search_button.style('font-size: 12px; background-color: #d9e6f2');
    search_button.mousePressed(search_key);

    key_input = createInput();
    key_input.size(32, 13);
    key_input.position(135, 121);

    clear_button = createButton("Clear Tree"); // button to reset and clear tree
    clear_button.position(30, 145);
    clear_button.style('font-size: 12px; background-color: #d9e6f2');
    clear_button.mousePressed(reset_tree, true);

    physics_button = createButton("Toggle Physics");
    physics_button.position(30, 170);
    physics_button.style('font-size: 12px; background-color: #d9e6f2');
    physics_button.mousePressed(toggle_physics);
    physics_button.style('background-color', 'rgb(246, 69, 69)');

    fill(0);
    text("Balance = 0", 810, 10);
    text("Balance >= 1", 810, 30);
    text("Balance <= -1", 810, 50);

    fill(255);
    rect(890, 1, 10, 10);

    fill(186, 213, 255);
    rect(890, 21, 10, 10);

    fill(186, 255, 209);
    rect(890, 41, 10, 10);

    noLoop(); // using redraw() to control animmation
}

function create_visualization(tree) {
    nodes = new vis.DataSet(tree.nodes);
    edges = new vis.DataSet(tree.edges);

    let container = document.getElementById('mynetwork');
    let data = {
        nodes: nodes,
        edges: edges
    };

    network = new vis.Network(container, data, network_options);
    network.storePositions();
}

function create_tree() {
    let val = Number(node_count.value());
    if (!isNaN(val)) {
        tree = new Tree(val);
        update_canvas = true;
        node_id_tracker = val + 100; //use to make new unique nodes for insertion
        redraw();
    }
}

function delete_node() { // so far only hides node TODO: finish
    if (network.getSelectedNodes().length == 0) {
        return;
    }
    let selected_id = network.getSelectedNodes()[0];
    let selected_node = nodes.get(selected_id);

    selected_node.label = "";
    selected_node.color = {
        border: "white",
        background: "white"
    };

    nodes.update(selected_node);
    network.selectNodes([],[]);
}

function insert_node() {
    let insert_key = Number(insert_input.value());
    if (tree.node_values.indexOf(insert_key) > -1) {
        return;
    }
    else {
        insert(tree.bst_root, insert_key);
        tree.node_values.push(insert_key);
    }
}

async function insert(node, key) {
    if (node == null) {
        insert_loc_found = true;
        return;
    }

    else {
        highlight_border(nodes.get(node.id), "rgb(242, 56, 255)");
        await sleep(animationTime);
        reset_border(nodes.get(node.id));

        if (key > Number(node.label)) {
            insert(node.right, key);
        }

        else {
            insert(node.left, key);
        }
    }
    //insert code
    if (insert_loc_found == true) {
        let bound;

        new_node = new Node(node_id_tracker, key.toString());
        tree.nodes.push(new_node);
        new_edge = new Edge(node.id, new_node.id);
        tree.edges.push(new_edge);

        if (key > Number(node.label)) {
            bound = "r";
            node.right = new_node;
        }
        else {
            bound = "l";
            node.left = new_node;
        }
        nodes.add(new_node);
        edges.add(new_edge);

        if (node.left != null && node.right != null) {
            let pos_node = network.getPositions([node.id])[node.id].x;
            let pos_new_node = network.getPositions([new_node.id])[new_node.id].x;

            if (bound == "r") { //if new node is on right
                if (pos_node > pos_new_node ) {//if its position is on left
                    let temp_data = node.left.label;
                    node.left.label = node.right.label;
                    node.right.label = temp_data;

                    let temp_node = node.left;
                    node.left = node.right;
                    node.right = temp_node;
                }
            }
            else {
                if (pos_node < pos_new_node) {
                    let temp_data = node.left.label;
                    node.left.label = node.right.label;
                    node.right.label = temp_data;

                    let temp_node = node.left;
                    node.left = node.right;
                    node.right = temp_node;
                }
            }
            nodes.update(node.right);
            nodes.update(node.left);
        }
        insert_loc_found = false;
        node_id_tracker++;
        //TODO: need to recalculate balances here: //not working, nodes and tree.nodes need updating
        for (let i = 0; i < tree.nodes.length; i++) {
            tree.nodes[i].balance = tree.nodes[i].calculate_balance();
            tree.nodes[i].set_color();
        }
    }
}

async function search_key() {
    network.selectNodes([],[]);
    let key = Number(key_input.value());
    search_found = false;
    await bst_search(tree.bst_root, key);
    console.log(search_found);
}

async function bst_search(node, key) {
    if (node == null) {
        search_found = false;
        return;
    }

    highlight_border(nodes.get(node.id), "rgb(245, 77, 51)");
    await sleep(animationTime);
    reset_border(nodes.get(node.id));

    if (key == Number(node.label)) {
        search_found = true;
        network.selectNodes([node.id], [false])
        reset_border(nodes.get(node.id));
        return;
    }

    else if (key > Number(node.label)) {
        return bst_search(node.right, key);
    }

    else {
        return bst_search(node.left, key);
    }
}

function highlight_border(node, color) {
    node.borderWidth = 3;
    node.color = {border: color};
    nodes.update(node);
}

function reset_border(node) {
    node.borderWidth = 1;
    node.color = {border: "black"};
    nodes.update(node);
}

function reset_tree() {
    tree = null
    network.destroy();
    network = null;
}

function toggle_physics() {
    network_options.physics.enabled = !(network_options.physics.enabled)
    network.setOptions(network_options);

    if (network_options.physics.enabled) {
        physics_button.style('background-color', 'rgb(87, 239, 87)');
    }

    else {
        physics_button.style('background-color', 'rgb(246, 69, 69)');
    }
}

function draw() {
    if (update_canvas) {
        if (tree != null) {
            create_visualization(tree);
        }
        update_canvas = false;
    }
}

function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(time);
        }, time);
    });
}
