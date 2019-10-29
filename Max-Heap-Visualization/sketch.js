let width = 1500; // canvas parameters
let height = 900;

tree = null;

let heap_made = false;
let tree_displayed = false;
let heapify_done = false;

function setup() {
    frameRate(5);
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


    clear_button = createButton("Clear Tree"); //button to reset and clear tree
    clear_button.position(50, 110);
    clear_button.mousePressed(reset_background);
    reset_background();
    noLoop();
}

function draw() {
    console.log("draw");
    if ((heap_made) && !tree_displayed) { //if tree active is not displayed and
        tree.display_tree();
        tree_displayed = true;
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
    text("0", legend_x_start, 30);
    text("100", legend_x_start + legend_w, 30);
}

function reset_background() { //draws gray backgroudn with legend correctly oriented
    background(200, 200, 200);
    draw_legend();
    fill(0, 0, 0);
    strokeWeight(0.1);
    textSize(14);
    textAlign(LEFT, CENTER);
    text("Number of Nodes", 95, 22);
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

function extract_heap_max() { // TODO: implement extraction, refresh, then heapify
    clear_node(0);
    tree_displayed = false;
    redraw();
}

function clear_node(idx) {
    tree.nodes[idx].r = 200;
    tree.nodes[idx].g = 200;
    tree.nodes[idx].b = 200;
}
