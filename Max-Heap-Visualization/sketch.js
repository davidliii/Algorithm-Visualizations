let width = 1500;
let height = 900;
tree = null;
let tree_made = false;
let heap_made = false;
let tree_displayed = false;

function setup() {
    window.canvas = createCanvas(width, height);

    node_input = createInput();
    node_input.size(45, 20);
    node_input.position(50, 20);

    build_tree = createButton("Build Tree");
    build_tree.position(50, 50);
    build_tree.mousePressed(create_tree);

    /*make_heap = createButton("Make Heap");
    make_heap.position(50, 50);
    make_heap.mousePressed(make_heap);*/

    extract_button = createButton("Extract Max");
    extract_button.position(50, 80);
    reset_background();
    //noLoop();
}

function draw() {
    if ((tree_made || heap_made) & !tree_displayed) {
        tree.display_tree();
        tree_displayed = true;
    }
}

function sleep(time) {
    var start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > time) {
            break;
        }
    }
}

function draw_legend() {
    var legend_w = 235;
    var legend_x_start = (width / 2) - (legend_w / 2);
    var legend_y_start = 10;
    var legend_y_end = 15;

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

function reset_background() {
    background(200, 200, 200);
    draw_legend();
    fill(0, 0, 0);
    textSize(14);
    textAlign(LEFT, CENTER);
    text("Number of Nodes", 95, 22);
}

function create_tree() {
    let val = Number(node_input.value());
    tree = new Tree(val);
    tree_made = true;
    tree_displayed = false;
}
