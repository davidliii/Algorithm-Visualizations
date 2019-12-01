let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset

let animationTime = 500;

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
    clear_button.mousePressed(reset_tree);

    physics_button = createButton("Toggle Physics");
    physics_button.position(30, 170);
    physics_button.style('font-size: 12px; background-color: #d9e6f2');
    physics_button.mousePressed(toggle_physics);
    physics_button.style('background-color', 'rgb(246, 69, 69)');

    info_button = createButton("Get selected info");
    info_button.position(30, 195);
    info_button.style('font-size: 12px; background-color: #d9e6f2');
    info_button.mousePressed(get_info);

    test_ccw_button = createButton("Test function CCW");
    test_ccw_button.position(30, 220);
    test_ccw_button.style('font-size: 12px; background-color: #d9e6f2');
    test_ccw_button.mousePressed(ccw_balance);

    test_cw_button = createButton("Test function CW");
    test_cw_button.position(30, 245);
    test_cw_button.style('font-size: 12px; background-color: #d9e6f2');
    test_cw_button.mousePressed(cw_balance);

    fill(0);
    text("Balance = 0", 810, 10);
    text("Balance = 1", 810, 30);
    text("Balance = -1", 810, 50);

    text("Balance > 1", 810, 100);
    text("Balance < -1", 810, 120);

    fill(255);
    rect(890, 1, 10, 10);
    fill(186, 213, 255);
    rect(890, 21, 10, 10);
    fill(186, 255, 209);
    rect(890, 41, 10, 10);
    fill(42, 80, 176);
    rect(890, 91, 10, 10);
    fill(34, 186, 59);
    rect(890, 111, 10, 10);

    noLoop(); // using redraw() to control animmation
}

function create_visualization() {
    let container = document.getElementById('mynetwork');
    let data = {
        nodes: nodes,
        edges: edges
    };

    network = new vis.Network(container, data, network_options);
}

function create_tree() {
    let val = Number(node_count.value());
    if (!isNaN(val)) {
        update_canvas = true;

        nodes = new vis.DataSet([
            {id:0, label: 'a', left_id: 1, right_id: 2},
            {id:1, label: 'b', left_id: 3, right_id: 4},
            {id:2, label: 'c', left_id: 5, right_id: 6},
            {id:3, label: 'd', left_id: null, right_id: null},
            {id:4, label: 'e', left_id: null, right_id: null},
            {id:5, label: 'f', left_id: null, right_id: null},
            {id:6, label: 'g', left_id: null, right_id: null},
        ]);

        edges = new vis.DataSet([
            {from:0, to:1},
            {from:0, to:2},
            {from:1, to:3},
            {from:1, to:4},
            {from:2, to:5},
            {from:2, to:6}
        ]);
    }
    create_visualization();
}

function delete_node() {

}

function insert_node() {

}

function search_key() {

}

function ccw_balance(root) {
    root = nodes.get(network.getSelectedNodes()[0]);
    if (root.right_id == null || nodes.get(root.right_id).left_id == null) {
        return;
    }
    let root_edges = network.getConnectedEdges(root.id); //get edges from root
    let right_edges = network.getConnectedEdges(root.right_id); //get edges from right child

    //find edge from root to left child
    let root_edge = null;
    for (let i = 0; i < root_edges.length; i++) {
        let edge = edges.get(root_edges[i]);
        if (edge.to == root.right_id) {
            root_edge = edge;
        }
    }
    //find edge from left child to left child's right child
    let right_edge = null;
    for (let i = 0; i < right_edges.length; i++) {
        let edge = edges.get(right_edges[i]);
        if (edge.to == nodes.get(root.right_id).left_id) {
            right_edge = edge;
        }
    }

    root_edge.to = nodes.get(root.right_id).left_id; //change where each edge points
    right_edge.from = root.right_id;
    right_edge.to = root.id;

    edges.update(root_edge); //update the dataset
    edges.update(right_edge);

    //also need to update parent if necesarry
}

function cw_balance(root) { //root from dataset
    root = nodes.get(network.getSelectedNodes()[0])
    if (root.left_id == null || nodes.get(root.left_id).right_id == null) { //check to see if balacing is valid
        return;
    }
    let root_edges = network.getConnectedEdges(root.id); //get edges from root
    let left_edges = network.getConnectedEdges(root.left_id); //get edges from left child

    //find edge from root to left child
    let root_edge = null;
    for (let i = 0; i < root_edges.length; i++) {
        let edge = edges.get(root_edges[i]);
        if (edge.to == root.left_id) {
            root_edge = edge;
        }
    }
    //find edge from left child to left child's right child
    let left_edge = null;
    for (let i = 0; i < left_edges.length; i++) {
        let edge = edges.get(left_edges[i]);
        if (edge.to == nodes.get(root.left_id).right_id) {
            left_edge = edge;
        }
    }

    root_edge.to = nodes.get(root.left_id).right_id; //change where each edge points
    left_edge.from = root.left_id;
    left_edge.to = root.id;

    edges.update(root_edge); //update the dataset
    edges.update(left_edge);

    //also need to update parent if necesarry
}

function reset_tree() {
    network.destroy();
    network = null;
    network_root = null;
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

function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(time);
        }, time);
    });
}

function get_info() {
    let selected_id = network.getSelectedNodes()[0];
    let selected_node = nodes.get(selected_id);

    console.log(selected_node);
}

function draw() {

}

function test() {

}
