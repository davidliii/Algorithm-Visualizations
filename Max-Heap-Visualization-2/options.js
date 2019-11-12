var options = { // visualization options
    autoResize:true,
    height:'100%',
    width:'100%',
    locale:'en',

    nodes: {
        color: {
            background: 'rgba(184, 227, 244, 1)',
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
    },
};
