let width = 1000; // canvas parameters
let height = 650;
let update_canvas = true; // redraw flag
let network = null;

let nodes = null; // node network dataset
let edges = null; // edge network dataset

let animation_time = 500;
let avl_root_id = null;

let insertion_location_found = false;

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

    realign_button = createButton("Realign Nodes");
    realign_button.position(30, 270);
    realign_button.style('font-size: 12px; background-color: #d9e6f2');
    realign_button.mousePressed(realign_all_nodes);

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
        tree = null; //garbage collection
        create_visualization();
    }
}
//----------------------------------------------------------------------------------------//
function delete_node() {
    let node_to_delete = nodes.get(network.getSelectedNodes()[0]);

    let num_nodes = nodes.get().length;
    if (num_nodes == 1) {
        nodes.remove(node_to_delete);
        avl_root_id = null;
        return;
    }

    //case 1 - leaf node delete
    if (node_to_delete.left_id == null && node_to_delete.right_id == null) {
        delete_leaf(node_to_delete);
    }

    //case 2 - delete node with only 1 child
    else if ((node_to_delete.left_id == null) || (node_to_delete.right_id == null)) {
        delete_node_with_one_child(node_to_delete);
    }

    //case 3 - delete node with two children
    else {
        delete_node_with_two_children(node_to_delete);
    }
    set_node_balances();
    realign_all_nodes();
}

function delete_leaf(node_to_delete) {
    let edge_id = network.getConnectedEdges(node_to_delete.id)[0];
    let edge = edges.get(edge_id);
    let parent_id = edge.from;
    let parent_node = nodes.get(parent_id);

    if (parent_node.left_id == node_to_delete.id) {
        parent_node.left_id = null;
    }

    if (parent_node.right_id == node_to_delete.id) {
        parent_node.right_id = null;
    }
    nodes.update(parent_node);
    edges.remove(edge);
    nodes.remove(node_to_delete);
}

function delete_node_with_one_child(node_to_delete) {
    let child_id;
    if (node_to_delete.left_id == null) {
        child_id = node_to_delete.right_id; //get child id
    }

    else {
        child_id = node_to_delete.left_id;
    }

    if (node_to_delete.id == avl_root_id) {
        avl_root_id = child_id;
    }

    let edge_ids = network.getConnectedEdges(node_to_delete.id);
    let edge_1 = edges.get(edge_ids[0]);
    let edge_2 = edges.get(edge_ids[1]);
    let parent_to_node_edge;
    let node_to_child_edge;

    if (edge_1.to == child_id) {
        node_to_child_edge = edge_1;
        parent_to_node_edge = edge_2;
    }

    else {
        node_to_child_edge = edge_2;
        parent_to_node_edge = edge_1;
    }

    edges.remove(node_to_child_edge);
    parent_to_node_edge.to = child_id;
    edges.update(parent_to_node_edge);

    let parent_id = parent_to_node_edge.from;
    let parent_node = nodes.get(parent_id);

    if (parent_node.left_id == node_to_delete.id) {
        parent_node.left_id = child_id;
    }

    if (parent_node.right_id == node_to_delete.id) {
        parent_node.right_id = child_id;
    }
    nodes.update(parent_node);
    nodes.remove(node_to_delete);
}

function delete_node_with_two_children(node_to_delete) {
    let successor_id = find_successor_id(node_to_delete.id);
    let successor_node = nodes.get(successor_id);

    if (node_to_delete.id == avl_root_id) { //update global root if necesary
        avl_root_id = successor_id;
    }

    if (successor_node.left_id == null && successor_node.right_id == null) {
        delete_leaf(successor_node);
    }

    else if ((successor_node.left_id == null) || (successor_node.right_id == null)) {
        delete_node_with_one_child(successor_node);
    }

    let node_edge_ids = network.getConnectedEdges(node_to_delete.id);
    let parent_id = null;
    for (let i = 0; i < node_edge_ids.length; i++) {
        let edge = edges.get(node_edge_ids[i]);
        if (edge.to == node_to_delete.id) {
            edge.to = successor_id;
            parent_id = edge.from;
        }

        if (edge.from == node_to_delete.id) {
            edge.from = successor_id;
        }
        edges.update(edge);
    }

    if (parent_id != null) {
        let parent = nodes.get(parent_id);
        if (parent.left_id == node_to_delete.id) {
            parent.left_id = successor_id;
        }

        if (parent.right_id == node_to_delete.id) {
            parent.right_id = sucessor_id;
        }
        nodes.update(parent);
    }

    let new_node = {
        id: successor_id,
        label: successor_id.toString(),
        right_id: node_to_delete.right_id,
        left_id: node_to_delete.left_id,
    };

    nodes.remove(node_to_delete);
    nodes.update(new_node);

    if (new_node.right_id == new_node.id) { //special case
        new_node.right_id = null;
    }

    if (new_node.left_id == new_node.id) { //special case
        new_node.left_id = null;
    }
    nodes.update(new_node);
}

function find_successor_id(node_id) {
    //find max in left sub-tree;
    let node = nodes.get(node_id);
    let successor_id = node.left_id;

    let successor = nodes.get(successor_id);
    let id;

    while (successor.right_id != null) {
        successor_id = successor.right_id;
        successor = nodes.get(successor_id);
    }

    return successor_id;
}

function insert_node() {
    let val_to_insert = Number(insert_input.value());
    insert(avl_root_id, val_to_insert);
}

async function insert(node_id, val_to_insert) { //rebalancing needed
    if (node_id == null) {
        insertion_location_found = true;
        return;
    }

    let node = nodes.get(node_id);

    highlight_node_border(node, "rgb(255, 105, 140)");
    await sleep(450);
    reset_node_border(node);

    if (val_to_insert < node.id) {
        insert(node.left_id, val_to_insert);
    }
    if (val_to_insert > node.id) {
        insert(node.right_id, val_to_insert);
    }
    if (val_to_insert == node.id) {
        return; //reject duplicate values in bst
    }

    if (insertion_location_found) {
        let edge = {from: node_id, to:val_to_insert};
        edges.update(edge);
        let new_node = {
            id: val_to_insert,
            label: val_to_insert.toString(),
            right_id: null,
            left_id: null,
            balance: 0};
        nodes.update(new_node);

        if (val_to_insert < node_id) {
            node.left_id = val_to_insert;
        }

        else {
            node.right_id = val_to_insert;
        }
        nodes.update(node);

        realign_children(node_id);
        set_node_balances();
        insertion_location_found = false;
    }
}
//----------------------------------------------------------------------------------------//
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
function find_unbalanced_node(starting_id) {

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
    realign_children(avl_root_id);
}

function realign_children(root_id) {
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

        let node_position = network.getPositions([root.id])[root.id].x

        if (left_position > right_position) { //correct positions in visualization
            left_node.x = right_position;
            right_node.x = left_position;
            nodes.update(left_node);
            nodes.update(right_node);
        }

        realign_children(left_node_id);
        realign_children(right_node_id);
    }
}
//----------------------------------------------------------------------------------------//
function reset_tree() {
    network.destroy();
    network = null;
    avl_root_id = null;
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
