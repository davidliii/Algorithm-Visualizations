var network_options = { // network visualization options
    autoResize:true,
    height:'100%',
    width:'100%',
    locale:'en',

    nodes: {
        color: {
            border: 'rgba(0, 0, 0, 1)',
            background: 'rgba(177, 220, 250, 1)'
        },
        shape:'circle',
        font: {
            align:'center'
        },
    },

    edges: {
        color:'black',
        selectionWidth:0.1,
        width:1,
        smooth: {
          type: 'continuous'
        }
    },

    physics: {
        enabled: false,
        repulsion: {
            nodeDistance: 100,
            centralGravity: 0.1,
            springLength: 100,
            springConstant: 0.65,
            damping: 0.5
        },
        maxVelocity: 10,
        solver: 'repulsion',
        stabilization: true,
        timestep: .1
    },

    layout: {
        hierarchical: {
            enabled: true,
            levelSeparation: 80,
            nodeSpacing: 80,
            edgeMinimization: false,
            direction: 'LR',
        }
    },

    configure: {
        enabled:false
    },

    interaction: {
        hideEdgesOnDrag: true,
        hideEdgesOnZoom: true
    }
};
