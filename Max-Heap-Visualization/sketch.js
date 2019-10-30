let width = 1500; // canvas parameters
let height = 900;

tree = null;

let heap_made = false;
let tree_displayed = false;
let heapify_done = false;

function setup() {
    //frameRate(1);
    window.canvas = createCanvas(width, height);

    node_input = createInput(); //user input for number of nodes
    node_input.size(45, 20);
    node_input.position(50, 20);

    build_tree = createButton("Build Heap"); //button to initialize tree
    build_tree.position(50, 50);
    build_tree.mousePressed(create_tree);

    extract_button = createButton("Extract Max"); //button to extract max of heap
    extract_button.position(50, 80);
    extract_button.mousePressed(extract_heap_max);

    heapify_button = createButton("Heapify"); //button to reset and clear tree
    heapify_button.position(50, 110);
    heapify_button.mousePressed(heapify_all);

    clear_button = createButton("Clear Tree"); //button to reset and clear tree
    clear_button.position(50, 140);
    clear_button.mousePressed(reset_background);

    reset_background();
    noLoop(); //using redraw() to control animmation
}

function draw() {
    if ((heap_made) && !tree_displayed) { //if tree active is not displayed and
        tree.display_tree();
        tree_displayed = true;
        heap_made = true;
    }
}

function draw_legend() { //draws gradient showing node values as colors
    let legend_w = 235;
    let legend_x_start = (width / 2) - (legend_w / 2);
    let legend_y_start = 10;
    let legend_y_end = 15;

    for (let i = 0; i <= legend_w; i++) {
        strokeWeight(10);
        stroke(0, 255 - i, 235 - i);
        line(legend_x_start + i, legend_y_start, legend_x_start + i, legend_y_end);
    }

    fill(0, 0, 0);
    stroke(0, 0, 0);
    textSize(15);
    strokeWeight(0.1);
    textAlign(CENTER, CENTER);
    text("255", legend_x_start, 30);
    text("0", legend_x_start + legend_w, 30);
}

function reset_background() { //draws gray background with legend correctly oriented
    background(200, 200, 200);
    draw_legend();
    fill(0, 0, 0);
    strokeWeight(0.1);
    textSize(14);
    textAlign(LEFT, CENTER);
    text("Number of Nodes", 95, 22);
    heap_made = false;
}

function create_tree() { //initializes a tree (non heap)
    let val = Number(node_input.value());
        if (!isNaN(val)) {
            tree = new Tree(val);
            heap_made = true;
            tree_displayed = false;
    }
    redraw();
}

function extract_heap_max() {
    if (!heap_made) {
        fill(0, 0, 0);
        strokeWeight(0.1);
        textSize(14);
        textAlign(LEFT, CENTER);
        text("Make a heap first!", 135, 83);
    }
    else {
        clear_node(0);
        tree_displayed = false;
        redraw();
    }
}

function clear_node(idx) {
    tree.nodes[idx].r = 200;
    tree.nodes[idx].g = 200;
    tree.nodes[idx].b = 200;
}

function heapify_all() {
    //setInterval(heapify_init, 500);
    heapify_init(); //remove right-most node and set it to the root
    setTimeout(heapify, 1000, 0); //perform heapify, redraw after each iteration
}

function heapify_init() {
    //copy data from last right-most leaf node into root
    let last_node_idx = tree.nodes.length - 1;
    tree.nodes[0].data = tree.nodes[last_node_idx].data
    tree.nodes[0].size = tree.nodes[last_node_idx].size;
    tree.nodes[0].r = tree.nodes[last_node_idx].r;
    tree.nodes[0].g = tree.nodes[last_node_idx].g;
    tree.nodes[0].b = tree.nodes[last_node_idx].b;
    tree.nodes.pop(); //remove right-most leaf node from node list
    tree_displayed = false;
    redraw();
}

function heapify(node_idx) {
    let left_idx = 2 * node_idx + 1;
    let right_idx = 2 * node_idx + 2;


    if (left_idx < tree.nodes.length && tree.nodes[node_idx].data < tree.nodes[left_idx].data) {
        //setTimeout(swap_node_data, 500, node_idx, left_idx);
        swap_node_data(node_idx, left_idx);
        setTimeout(heapify, 500, left_idx);
    }

    else if (right_idx < tree.nodes.length && tree.nodes[node_idx].data < tree.nodes[right_idx].data) {
        //setTimeout(swap_node_data, 500, node_idx, right_idx);
        swap_node_data(node_idx, right_idx);
        setTimeout(heapify, 500, right_idx);
    }
}

function swap_node_data(node1, node2) {
    let temp_data = tree.nodes[node1].data;
    let temp_r = tree.nodes[node1].r;
    let temp_g = tree.nodes[node1].g;
    let temp_b = tree.nodes[node1].b;

    tree.nodes[node1].data = tree.nodes[node2].data;
    tree.nodes[node1].r = tree.nodes[node2].r;
    tree.nodes[node1].g = tree.nodes[node2].g;
    tree.nodes[node1].b = tree.nodes[node2].b;

    tree.nodes[node2].data = temp_data;
    tree.nodes[node2].r = temp_r;
    tree.nodes[node2].g = temp_g;
    tree.nodes[node2].b = temp_b;
    tree_displayed = false;
    redraw();
    console.log("swapped");
}
