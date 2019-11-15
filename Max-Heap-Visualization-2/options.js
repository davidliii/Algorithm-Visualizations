var network_options = { // network visualization options
    autoResize:true,
    height:'100%',
    width:'100%',
    locale:'en',

    nodes: {
        color: {
            border: 'rgba(0, 0, 0, 1)'
        },
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
        enabled:false,
        hierarchicalRepulsion: {
            nodeDistance:50,
            centralGravity:0.01,
            springLength:10,
            springConstant:0.01,
        },
        maxVelocity:20,
        minVelocity:0.1,
        solver: 'hierarchicalRepulsion'
    },

    layout: {
        hierarchical: {
            enabled:true,
            parentCentralization:true,
            sortMethod:'directed',
            direction:'UD',
            shakeTowards:'roots',
            nodeSpacing:34,
            levelSeparation:200,
            blockShifting:true,
            edgeMinimization:false
        }
    },

    configure: {
        enabled:false
    },
};

var animation_options = {
    scale:1,
    offset: {
        x:0, y:0
    },

    locked:false,
    animation: {
        duration: 1000,
        easingFunction: 'linear'
    }
};
