let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let tree = null;
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset

function init_tree_parameters(num_nodes) { // initialize tree object
    return new Tree(num_nodes);
}

function create_tree() { // creates tree object and draws to canvas
    let val = Number(node_count.value());
    if (!isNaN(val)) {
        tree = init_tree_parameters(val);
    }
    update_canvas = true;
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
    heap_sort.mousePressed(extract_heapify);

    clear_button = createButton("Clear Tree"); // button to reset and clear tree
    clear_button.position(30, 145);
    clear_button.style('font-size: 12px; background-color: #d9e6f2');
    clear_button.mousePressed(reset_tree, true);

    physics_button = createButton("Toggle Physics");
    physics_button.position(30, 170);
    physics_button.style('font-size: 12px; background-color: #d9e6f2');
    physics_button.mousePressed(toggle_physics);
    physics_button.style('background-color', 'rgb(246, 69, 69)');


    text('Last Extracted Max: ', 810, 10);
    noLoop(); // using redraw() to control animmation
}

function write_max(data) {
    background(255); //clear old text
    text('Last Extracted Max: ', 810, 10);
    text(data, 920, 10);
}

function extract_heap_max() {
    let root_id = nodes.min('id').id; // get value at root
    write_max(nodes.get(root_id).label); // display
    //setTimeout(function() {nodes.remove(root) } , 100); //delays removal
    network.fit(animation_options); //readjust camera settings
    nodes.remove(root_id);
}

async function extract_heapify() {
    let extract_done = false;

    extract_heap_max();
    time = await sleep(500);
    heapify_network();
}

async function heapify_network() {
    let node_to_move = nodes.max('id').id;
    let new_root_value = nodes.max('id').label;
    nodes.remove(node_to_move)
    node = new Node(0, new_root_value);
    network.body.data.nodes.add(node);

    time = await sleep(500);
    heapify_down(0);
    //setTimeout(heapify_down, 200, 0);
}

async function heapify_down(node_id) {
    let done = false;
    let left_id = 2 * node_id + 1;
    let right_id = 2 * node_id + 2;

    let max_id = node_id;

    if (left_id < nodes.length && Number(nodes.get(left_id).label) > Number(nodes.get(max_id).label)) {
        max_id = left_id;
    }

    if (right_id < nodes.length && Number(nodes.get(right_id).label) > Number(nodes.get(max_id).label)) {
        max_id = right_id;
    }

    if (max_id != node_id) {
        swap_nodes(node_id, max_id);
        let time = await sleep(500);
        heapify_down(max_id);
        time = await sleep(500);
    }
}

function swap_nodes(id1, id2) {
    let data1 = nodes.get(id1).label;
    let data2 = nodes.get(id2).label;

    nodes.remove(id2);
    new_node2 = new Node(id2, data1);

    nodes.remove(id1);
    new_node1 = new Node(id1, data2);

    nodes.add(new_node2);
    nodes.add(new_node1);
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
