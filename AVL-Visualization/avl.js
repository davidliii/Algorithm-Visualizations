let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let tree = null;
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset

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
}

function create_tree() {
    let val = Number(node_count.value());
    if (!isNaN(val)) {
        tree = new Tree(val);
        update_canvas = true;
        redraw();
    }
}

function delete_node() {

}

function insert_node() {

}

function search_key() {

}

function reset_tree() {

}

function draw() {
    if (update_canvas) {
        if (tree != null) {
            create_visualization(tree);
        }
        update_canvas = false;
    }
}
