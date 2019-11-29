let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let graph = null;
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset

let animationTime = 500;

let src = null;
let dest = null;

function setup() {
    canvas = createCanvas(width, height);

    node_count = createInput(); //user input for number of nodes
    node_count.size(45, 15);
    node_count.position(115, 45);

    src_input = createInput(); //user input for number of nodes
    src_input.size(45, 15);
    src_input.position(110, 70);

    dest_input = createInput(); //user input for number of nodes
    dest_input.size(45, 15);
    dest_input.position(135, 95);

    build_graph = createButton("Build Graph"); //button to initialize graph
    build_graph.position(30, 45);
    build_graph.style('font-size: 12px; background-color: #d9e6f2');
    build_graph.mousePressed(create_graph);

    src_set_button = createButton("Set Source");
    src_set_button.position(30, 70);
    src_set_button.style('font-size: 12px; background-color: #d9e6f2');
    src_set_button.mousePressed(select_src);

    dest_set_button = createButton("Set Destination");
    dest_set_button.position(30, 95);
    dest_set_button.style('font-size: 12px; background-color: #d9e6f2');
    dest_set_button.mousePressed(select_dest);

    find_path = createButton("Find Shortest Path");
    find_path.position(30, 120);
    find_path.style('font-size: 12px; background-color: #d9e6f2');
    find_path.mousePressed();

    clear_button = createButton("Clear Graph"); // button to reset and clear graph
    clear_button.position(30, 145);
    clear_button.style('font-size: 12px; background-color: #d9e6f2');
    clear_button.mousePressed(reset_graph);

    noLoop(); // using redraw() to control animmation
}

function create_visualization(graph) {
    nodes = new vis.DataSet(graph.nodes);
    edges = new vis.DataSet(graph.edges);

    let container = document.getElementById('mynetwork');
    let data = {
        nodes: nodes,
        edges: edges
    };

    network = new vis.Network(container, data, network_options);
}

function create_graph() {
    let val = Number(node_count.value());
    if (!isNaN(val)) {
        graph = new Graph(val);
        update_canvas = true;
        redraw();
    }
}

function select_src() {
    let src_id = Number(src_input.value());
    if (!isNaN(src_id)) {
        if (src != null) {
            reset_color(src);
        }
        set_color(src_id, "rgb(232, 118, 19)");
        src = src_id;
    }
}

function select_dest() {
    let dest_id = Number(dest_input.value());
    if (!isNaN(dest_id)) {
        if (dest != null) {
            reset_color(dest);
        }
        set_color(dest_id, "rgb(255, 66, 198)");
        dest = dest_id;
    }
}

function set_color(node_id, color) {
    let x = nodes.get(node_id);
    x.color = color;
    nodes.update(x);
}

function reset_color(node_id) {
    let x = nodes.get(node_id);
    x.color = {
        border: 'rgba(0, 0, 0, 1)',
        background: 'rgba(177, 220, 250, 1)'
    }
    nodes.update(x);
}

function reset_graph() {
    graph = null
    network.destroy();
    network = null;
}

function draw() {
    if (update_canvas) {
        if (graph != null) {
            create_visualization(graph);
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
