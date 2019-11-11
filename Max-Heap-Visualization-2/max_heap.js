var tree = new Tree(2000); //create max heap
var nodes = new vis.DataSet(tree.nodes);
var edges = new vis.DataSet(tree.edges);

var container = document.getElementById('mynetwork');

var data = {
    nodes: nodes,
    edges: edges
};

var options = {
    autoResize:true,
    height:'100%',
    width:'100%',
    locale:'en',

    nodes: {
        color:'rgba(184, 227, 244, 1)',
        shape:'circle',
        font: {
            align:'center'
        }
    },

    edges: {
        color:'black',
        selectionWidth:0.1,
        width:1
    },

    physics: {
        enabled:false
    },

    layout: {
        hierarchical: {
            enabled:true,
            parentCentralization:true,
            sortMethod:'directed',
            direction:'UD',
            shakeTowards:'roots',
            nodeSpacing:30,
            levelSeparation:200,
            blockShifting:true,
            edgeMinimization:true
        }
    },

    configure: {
        enabled:false
    }
};
var network = new vis.Network(container, data, options);
