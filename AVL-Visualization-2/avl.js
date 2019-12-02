let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset

let animation_time = 500;
let avl_root_id = null;

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

    insert_input = createInput();
    insert_input.size(32, 13);
    insert_input.position(120, 96);

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
    clear_button.mousePressed(reset_tree);

    physics_button = createButton("Toggle Physics");
    physics_button.position(30, 170);
    physics_button.style('font-size: 12px; background-color: #d9e6f2');
    physics_button.mousePressed(toggle_physics);
    physics_button.style('background-color', 'rgb(246, 69, 69)');

    info_button = createButton("Get selected info");
    info_button.position(30, 195);
    info_button.style('font-size: 12px; background-color: #d9e6f2');
    info_button.mousePressed(get_info);

    test_ccw_button = createButton("CCW Rotate Selected");
    test_ccw_button.position(30, 220);
    test_ccw_button.style('font-size: 12px; background-color: #d9e6f2');
    test_ccw_button.mousePressed(ccw_rotate);

    test_cw_button = createButton("CW Rotate Selected");
    test_cw_button.position(30, 245);
    test_cw_button.style('font-size: 12px; background-color: #d9e6f2');
    test_cw_button.mousePressed(cw_rotate);

    realign_button = createButton("Realign children of Selected");
    realign_button.position(30, 270);
    realign_button.style('font-size: 12px; background-color: #d9e6f2');
    realign_button.mousePressed(realign_children);

    set_balance_button = createButton("Set node balances");
    set_balance_button.position(30, 295);
    set_balance_button.style('font-size: 12px; background-color: #d9e6f2');
    set_balance_button.mousePressed(set_node_balances);

    fill(0);
    text("Balance = 0", 810, 10);
    text("Balance = 1", 810, 30);
    text("Balance = -1", 810, 50);

    text("Balance > 1", 810, 100);
    text("Balance < -1", 810, 120);

    fill(255);
    rect(890, 1, 10, 10);
    fill(186, 213, 255);
    rect(890, 21, 10, 10);
    fill(186, 255, 209);
    rect(890, 41, 10, 10);
    fill(42, 80, 176);
    rect(890, 91, 10, 10);
    fill(34, 186, 59);
    rect(890, 111, 10, 10);

    noLoop(); // using redraw() to control animmation
}

function create_visualization() {
    let container = document.getElementById('mynetwork');
    let data = {
        nodes: nodes,
        edges: edges
    };

    network = new vis.Network(container, data, network_options);
    network.storePositions();
    set_node_balances();
}

function create_tree() {
    let val = Number(node_count.value());
    if (!isNaN(val)) {
        update_canvas = true;
        let tree_values = new TreeValueGenerator(val);
        nodes = new vis.DataSet(tree_values.nodes);
        edges = new vis.DataSet(tree_values.edges);
        avl_root_id = tree_values.root_id;
        create_visualization();
    }
}
//----------------------------------------------------------------------------------------//

function delete_node() { //TODO: implement

}

function insert_node() { //TODO: implement

}

function search_key() {
    let key = Number(key_input.value());
    search(avl_root_id, key);
}

async function search(node_id, key) {
    if (node_id == null) {
        return;
    }
    let node = nodes.get(node_id);
    highlight_node_border(node, 'rgb(245, 77, 51)');
    await sleep(animation_time);
    reset_node_border(node);

    if (Number(node.label) == key) {
        network.selectNodes([node_id]);
    }

    else if (Number(node.label) < key) {
        search(node.right_id, key);
    }

    else {
        search(node.left_id, key);
    }
}

function highlight_node_border(node, color) {
    node.borderWidth = 3;
    node.color = {border: color};
    nodes.update(node);
}

function reset_node_border(node) {
    node.borderWidth = 1;
    node.color = {border: "black"};
    nodes.update(node);
}
//----------------------------------------------------------------------------------------//
function set_node_balances() { //need to run this function anytime something changes in the tree
    let all_nodes = nodes.get();
    for (let i = 0; i < all_nodes.length; i++) {
        let node = all_nodes[i];
        node.balance = set_balance(node.id);
        //for each node, update its color based on balance
        nodes.update(node);
        set_balance_color(node.id);
    }
}

function set_balance(node_id) {
    let node = nodes.get(node_id);
    let left_height = get_tree_height(node.left_id);
    let right_height = get_tree_height(node.right_id);

    return left_height - right_height;
}

function get_tree_height(node_id) {
    if (node_id == null) {
        return 0;
    }
    let node = nodes.get(node_id);
    let left_height = get_tree_height(node.left_id);
    let right_height = get_tree_height(node.right_id);

    let max_height = max(left_height, right_height) + 1;
    return max_height;
}

function set_balance_color(node_id) {
    let color;
    let balance = nodes.get(node_id).balance;
    if (balance == 0) {
        color = "rgb(255, 255, 255)";
    }

    else if (balance == -1) {
        color = "rgb(186, 255, 209)";
    }

    else if (balance == 1) {
        color = "rgb(186, 213, 255)";
    }

    else if (balance > 1) {
        color = "rgb(42, 80, 176)";
    }

    else {
        color = "rgb(34, 186, 59)";
    }
    set_node_color(node_id, color)
}

function set_node_color(node_id, color) {
    let node = nodes.get(node_id);
    node.color = {background: color};
    nodes.update(node);
}
//----------------------------------------------------------------------------------------//
function ccw_rotate(root) { //NOTE: root from dataset
    if (root == null) { //if no root specified, perform on selected node
        root = nodes.get(network.getSelectedNodes()[0]);
    }

    if (root.right_id == null || nodes.get(root.right_id).left_id == null) {
        return;
    }
    let root_edges = network.getConnectedEdges(root.id); //get edges from root
    let right_edges = network.getConnectedEdges(root.right_id); //get edges from right child

    //find edge from root to left child
    let root_edge = null;
    let parent_edge = null;
    for (let i = 0; i < root_edges.length; i++) {
        let edge = edges.get(root_edges[i]);
        if (edge.to == root.right_id) {
            root_edge = edge;
        }
        if (edge.to == root.id) {
            parent_edge = edge; //find parent edge is applicable
        }
    }
    //find edge from left child to left child's right child
    let right_edge = null;
    for (let i = 0; i < right_edges.length; i++) {
        let edge = edges.get(right_edges[i]);
        if (edge.to == nodes.get(root.right_id).left_id) {
            right_edge = edge;
        }
    }

    root_edge.to = nodes.get(root.right_id).left_id; //change where each edge points
    right_edge.from = root.right_id;
    right_edge.to = root.id;

    if (parent_edge == null) {
        avl_root_id = root.right_id; //update global root if needed
    }
    edges.update(root_edge); //update the dataset
    edges.update(right_edge);
    if (parent_edge != null) {
        parent_edge.to = root.right_id;
        edges.update(parent_edge);
        let parent = nodes.get(parent_edge.from);
        //check to see if it is parents left or right
        if (parent.right_id == root.id) {
            parent.right_id = root.right_id;
        }

        else {
            parent.left_id = root.right_id;
        }

        nodes.update(parent);
    }
    let right_node = nodes.get(root.right_id);
    root.right_id = nodes.get(root.right_id).left_id;
    right_node.left_id = root.id;

    nodes.update(root);
    nodes.update(right_node);
    network.fit();
    set_node_balances();
    realign_all_nodes()
}

function cw_rotate(root) { // NOTE: root from dataset
    if (root == null) { //if no root specified, perform on selected node
        root = nodes.get(network.getSelectedNodes()[0]);
    }
    if (root.left_id == null || nodes.get(root.left_id).right_id == null) { //check to see if balacing is valid
        return;
    }
    let root_edges = network.getConnectedEdges(root.id); //get edges from root
    let left_edges = network.getConnectedEdges(root.left_id); //get edges from left child

    //find edge from root to left child
    let root_edge = null;
    let parent_edge = null;
    for (let i = 0; i < root_edges.length; i++) {
        let edge = edges.get(root_edges[i]);
        if (edge.to == root.left_id) {
            root_edge = edge;
        }
        if (edge.to == root.id) {
            parent_edge = edge; //find parent edge is applicable
        }
    }
    //find edge from left child to left child's right child
    let left_edge = null;
    for (let i = 0; i < left_edges.length; i++) {
        let edge = edges.get(left_edges[i]);
        if (edge.to == nodes.get(root.left_id).right_id) {
            left_edge = edge;
        }
    }

    root_edge.to = nodes.get(root.left_id).right_id; //change where each edge points
    left_edge.from = root.left_id;
    left_edge.to = root.id;

    if (parent_edge == null) {
        avl_root_id = root.left_id; //update global root if needed
    }

    edges.update(root_edge); //update the dataset
    edges.update(left_edge);
    if (parent_edge != null) {
        parent_edge.to = root.left_id;
        edges.update(parent_edge);
        let parent = nodes.get(parent_edge.from);
        parent.left_id = root.left_id;
        //check to see if it is parents left or right
        if (parent.right_id == root.id) {
            parent.right_id = root.left_id;
        }

        else {
            parent.left_id = root.left_id;
        }
        nodes.update(parent);
    }

    //need to update node left and right ids
    let left_node = nodes.get(root.left_id);
    root.left_id = nodes.get(root.left_id).right_id;
    left_node.right_id = root.id;

    nodes.update(root);
    nodes.update(left_node);
    network.fit();
    set_node_balances();
    realign_all_nodes()
}
//----------------------------------------------------------------------------------------//
function realign_all_nodes() {
    let all_nodes = nodes.get();
    for (let i = 0; i < all_nodes.length; i++) {
        realign_children(all_nodes[i].id);
    }
}

function realign_children(root_id) {
    if (root_id == null) {
        let root_id = nodes.get(network.getSelectedNodes()[0]).id;
    }

    if (root_id != null) {
        let root = nodes.get(root_id);
        let left_node_id = root.left_id;
        let right_node_id = root.right_id;

        if (left_node_id == null || right_node_id == null) {
            return;
        }

        let left_node = nodes.get(left_node_id);
        let right_node = nodes.get(right_node_id);

        let left_position = network.getPositions([left_node.id])[left_node.id].x;
        let right_position = network.getPositions([right_node.id])[right_node.id].x;

        if (left_position > right_position) { //correct positions in visualization
            left_node.x = right_position;
            right_node.x = left_position;
            nodes.update(left_node);
            nodes.update(right_node);
        }
    }
}
//----------------------------------------------------------------------------------------//
function reset_tree() {
    network.destroy();
    network = null;
    network_root = null;
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

function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(time);
        }, time);
    });
}

function get_info() {
    let selected_id = network.getSelectedNodes()[0];
    let selected_node = nodes.get(selected_id);

    console.log(selected_node);
}
