let width = 900; // canvas parameters
let height = 600;
let update_canvas = true; // redraw flag
let tree = null;
let network = null;

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
    tree = init_tree_parameters(0);
    update_canvas = true;
    redraw();
}

function create_visualization(tree) { //given tree object, builds canvas visualization
    let nodes = new vis.DataSet(tree.nodes);
    let edges = new vis.DataSet(tree.edges);

    let container = document.getElementById('mynetwork');

    let data = {
        nodes: nodes,
        edges: edges
    };

    network = new vis.Network(container, data, options);
}

function setup() {
    canvas = createCanvas(width, height);

    node_count = createInput(); //user input for number of nodes
    node_count.size(45, 15);
    node_count.position(50, 20);

    build_tree = createButton("Build Heap"); //button to initialize heap
    build_tree.position(50, 45);
    build_tree.style('font-size: 12px; background-color: #d9e6f2');
    build_tree.mousePressed(create_tree);

    extract_button = createButton("Extract Max"); //button to extract max of heap
    extract_button.position(50, 70);
    extract_button.style('font-size: 12px; background-color: #d9e6f2');
    //extract_button.mousePressed(extract_heap_max);

    heapify_button = createButton("Heapify"); //button to reorganize heap
    heapify_button.position(50, 95);
    heapify_button.style('font-size: 12px; background-color: #d9e6f2');
    //heapify_button.mousePressed(heapify_all);

    heap_sort = createButton("Extract Max + Heapify"); //button to reorganize heap
    heap_sort.position(50, 120);
    heap_sort.style('font-size: 12px; background-color: #d9e6f2');
    //heap_sort.mousePressed(extract_heapify);

    clear_button = createButton("Clear Tree"); //button to reset and clear tree
    clear_button.position(50, 145);
    clear_button.style('font-size: 12px; background-color: #d9e6f2');
    clear_button.mousePressed(reset_tree, true);

    noLoop(); //using redraw() to control animmation
}

function draw() {
    if (update_canvas) {
        if (tree != null) {
            create_visualization(tree);
        }
        update_canvas = false;
    }
}
