let width = 1500;
let height = 900;

function setup() {
    window.canvas = createCanvas(width, height);
    tree = new Tree(127);
    noLoop();
}

function draw() {
    tree.display_tree();
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
}
