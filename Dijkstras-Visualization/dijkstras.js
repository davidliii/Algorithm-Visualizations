let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let graph = null;
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset

let pass_time = 500;
let highlight_time = 50;

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
    find_path.mousePressed(find_shortest);

    clear_button = createButton("Clear Graph"); // button to reset and clear graph
    clear_button.position(30, 145);
    clear_button.style('font-size: 12px; background-color: #d9e6f2');
    clear_button.mousePressed(reset_graph);

    get_info_button = createButton("Get Element Info"); // get node info to console
    get_info_button.position(30, 170);
    get_info_button.style('font-size: 12px; background-color: #d9e6f2');
    get_info_button.mousePressed(get_info);

    test_function_button = createButton("Reset Path"); // test
    test_function_button.position(30, 195);
    test_function_button.style('font-size: 12px; background-color: #d9e6f2');
    test_function_button.mousePressed(reset_path);

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

    let src = null;
    let dest = null;
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
    if (src != null) {
        reset_node_color(src.id);
    }

    let src_id = Number(src_input.value());
    if (!isNaN(src_id)) {
        set_node_color(src_id, "rgb(232, 118, 19)");
        src = nodes.get(src_id);
    }
}

function select_dest() {
    if (dest != null) {
        reset_node_color(dest.id);
    }

    let dest_id = Number(dest_input.value());
    if (!isNaN(dest_id)) {
        set_node_color(dest_id, "rgb(255, 66, 198)");
        dest = nodes.get(dest_id);
    }
}

function set_examined_node(id) {
    set_node_color(id, "#79cf72");
}

function set_node_color(node_id, color) {
    let x = nodes.get(node_id);
    x.color = color;
    nodes.update(x);
}

function reset_node_color(node_id) {
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

function get_info() {
    let selected_element = network.getSelection();
    console.log(selected_element);

    for (let i = 0; i < selected_element.edges.length; i++) {
        let edge = edges.get(selected_element.edges[i]);
        console.log(edge);
    }
}
//-----------------------------------------------------------------------------------//

async function find_shortest() {
    if (src == null || dest == null) { //check for valid inputs
        return;
    }

    if (src.id == dest.id) { //do something
        return;
    }

    let graph_nodes = nodes.get(); //get list of network nodes

    let vList = Array(0); //ordered by id
    for (let i = 0; i < graph_nodes.length; i++) { //make vertex list
        let id = i;
        let dist = Number.POSITIVE_INFINITY;
        if (i == src.id) {
            dist = 0;
        }
        let loc_in_queue = i;

        let v = new Vertex(id, dist, loc_in_queue);
        vList.push(v);
    }

    let vertices = Array(0); //ordered by dist (make into min heap)
    for (let i = 0; i < graph_nodes.length; i++) { //make vertex list
        let id = i;
        let dist = Number.POSITIVE_INFINITY;
        if (i == src.id) {
            dist = 0;
        }
        let loc_in_queue = null;

        let v = new Vertex(id, dist, loc_in_queue);
        vertices.push(v);
    }

    queue = new Queue(vertices, vList);

    let curr_id = queue.peak().id;
    while (curr_id != dest.id) {
        let neighbors = network.getConnectedNodes(curr_id);

        for (let i = 0; i < neighbors.length; i++) {
            if (queue.vList[neighbors[i]].loc_in_queue >= 0) {
                set_examined_node(neighbors[i]);
                await sleep(highlight_time);
                let old_dist = queue.vList[neighbors[i]].dist;
                let weight = find_weight(curr_id, neighbors[i]);
                let new_dist = queue.vList[curr_id].dist + weight;

                if (new_dist < old_dist) {
                    queue.vList[neighbors[i]].dist = new_dist;
                    queue.vList[neighbors[i]].last_id = curr_id;
                    queue.vertices[queue.vList[neighbors[i]].loc_in_queue].dist = new_dist;
                    queue.vertices[queue.vList[neighbors[i]].loc_in_queue].last_id = curr_id;
                    queue.heapify_up(queue.vList[neighbors[i]].loc_in_queue);
                }
            }
        }

        queue.extract_min();
        curr_id = queue.peak().id;
        await sleep(pass_time);
    }
    console.log("done");
    do_traceback(queue);
}

async function do_traceback(queue) { //TODO :display distance/path on screen
    let path = Array(0);
    let curr_id = dest.id;
    while (curr_id != -1) {
        path.unshift(curr_id)
        curr_id = queue.vList[curr_id].last_id;
    }

    if (path[0] != src.id) {
        console.log([src.id, dest.id]);
        console.log("distance: INFINITY");
        return;
    }
    console.log(path);
    console.log("distance: " + queue.vList[path[path.length - 1]].dist);

    for (let i = 0; i < path.length; i++) {
        set_path_node(path[i]);
        if (i < path.length) {
            let path_edge = new Edge(path[i], path[i + 1], 0);
            let path_edge_id = edges.add(path_edge)[0];
            set_path_edge(path_edge_id);
        }
        await sleep(highlight_time);
    }
}

function find_weight(curr_id, neighbor) {
    let possible_edge_ids = network.getConnectedEdges(curr_id);
    for (let i = 0; i < possible_edge_ids.length; i++) {
        set_examined_path(possible_edge_ids[i]);
        let possible_edge = edges.get(possible_edge_ids[i]);
        if ((possible_edge.to == neighbor && possible_edge.from == curr_id)
        || possible_edge.from == neighbor && possible_edge.to == curr_id) {
            return possible_edge.weight;
        }
    }
    return 0;
}

function highlight_edge(edge_id, color) {
    let edge = edges.get(edge_id);
    edge.color = color;
    edge.width = 3;
    edges.update(edge);
}

function set_examined_path(id) {
    highlight_edge(id, "#79cf72");
}

function reset_edge_color(id) {
    let edge = edges.get(id);
    edge.color = "black";
    edge.width = 1;
    edges.update(edge);
}

function reset_path() {
    let node_ids = nodes.get();
    let edge_ids = edges.get();

    for (let i = 0; i < node_ids.length; i++) {
        reset_node_color(node_ids[i].id);
    }

    for (let i = 0; i < edge_ids.length; i++) {
        reset_edge_color(edge_ids[i].id);
    }
}

function set_path_node(id) {
    set_node_color(id, "#4e33ff");
}

function set_path_edge(id) {
    highlight_edge(id, "#4e33ff");
}
