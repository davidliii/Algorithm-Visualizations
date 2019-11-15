let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let tree = null;
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset
let root = null; // use to keep track of the id of the root
let max_id = null; // keep track of node to be inserted at root for heapify

function init_tree_parameters(num_nodes) { // initialize tree object
    return new Tree(num_nodes);
}

function create_tree() { // creates tree object and draws to canvas
    let val = Number(node_count.value());
    if (!isNaN(val)) {
        tree = init_tree_parameters(val);
    }
    update_canvas = true;
    max_id = val - 1; //initialize max_id
    redraw();
}

function reset_tree() { //clears tree
    tree = null
    network.destroy();
    network = null;
}

function create_visualization(tree) { //given tree object, builds canvas visualization
    nodes = new vis.DataSet(tree.nodes);
    edges = new vis.DataSet(tree.edges);

    let container = document.getElementById('mynetwork');

    let data = {
        nodes: nodes,
        edges: edges
    };

    network = new vis.Network(container, data, network_options);
    root = 0;
}

function setup() {
    canvas = createCanvas(width, height);

    node_count = createInput(); //user input for number of nodes
    node_count.size(45, 15);
    node_count.position(30, 20);

    build_tree = createButton("Build Heap"); //button to initialize heap
    build_tree.position(30, 45);
    build_tree.style('font-size: 12px; background-color: #d9e6f2');
    build_tree.mousePressed(create_tree);

    extract_button = createButton("Extract Max"); //button to extract max of heap
    extract_button.position(30, 70);
    extract_button.style('font-size: 12px; background-color: #d9e6f2');
    extract_button.mousePressed(extract_heap_max);

    heapify_button = createButton("Heapify"); //button to reorganize heap
    heapify_button.position(30, 95);
    heapify_button.style('font-size: 12px; background-color: #d9e6f2');
    heapify_button.mousePressed(heapify_network);

    heap_sort = createButton("Extract Max + Heapify"); //button to reorganize heap
    heap_sort.position(30, 120);
    heap_sort.style('font-size: 12px; background-color: #d9e6f2');
    //heap_sort.mousePressed(extract_heapify);

    clear_button = createButton("Clear Tree"); // button to reset and clear tree
    clear_button.position(30, 145);
    clear_button.style('font-size: 12px; background-color: #d9e6f2');
    clear_button.mousePressed(reset_tree, true);

    text('Last Extracted Max: ', 810, 10);
    noLoop(); // using redraw() to control animmation
}

function write_max(data) {
    background(255); //clear old text
    text('Last Extracted Max: ', 810, 10);
    text(data, 920, 10);
}

function extract_heap_max() {
    let value = nodes.get(root); // get value at root
    write_max(value.label); // display
    network.fit(animation_options); //readjust camera settings
    //setTimeout(function() {nodes.remove(root) } , 100); //delays removal
    nodes.remove(root);
}

function heapify_network() {

}

function draw() {
    if (update_canvas) {
        if (tree != null) {
            create_visualization(tree);
        }
        update_canvas = false;
    }
}
