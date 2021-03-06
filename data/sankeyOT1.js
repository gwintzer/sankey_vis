(function () {

    // marge du tableau / graphique
    const margin = 10;
    // largeur
    const width = 1410;
    // hauteur
    const height = 750;
    // couleur de fond du graphique
    const svgBackground = "#eee";
    // bord du svg
    const svgBorder = "1px solid #333";


    //   NODE
    // largeur du node
    const nodeWidth = 24;
    // espace entre les noeuds
    const nodePadding = 6;
    // opacité des noeuds
    const nodeOpacity = 1;
    // opacité des liens
    const linkOpacity = 0.5;
    // ??
    const nodeDarkenFactor = 0.3;
    //  ???
    const nodeStrokeWidth = 4;
    const arrow = "\u2192";
    const nodeAlignment = d3.sankeyCenter;
    const colorScale = d3.interpolateRainbow;
    const path = d3.sankeyLinkHorizontal();
    let initialMousePosition = {};
    let initialNodePosition = {};

    function addGradientStop(gradients, offset, fn) {
        return gradients.append("stop")
                        .attr("offset", offset)
                        .attr("stop-color", fn);
    }

    function color(index) {
        let ratio = index / (data.nodes.length - 1.0);
        return colorScale(ratio);
    }
    
    function darkenColor(color, factor) {
        return d3.color(color).darker(factor)
    }
    
    function getGradientId(d) {
        return `gradient_${d.source.id}_${d.target.id}`;
    }
    
    function getMousePosition(e) {
        e = e || d3.event;
        return {
            x: e.x,
            y: e.y
        };
    }
    
    function getNodePosition(node) {
        return {
            x: +node.attr("x"),
            y: +node.attr("y"),
            width: +node.attr("width"),
            height: +node.attr("height")
        };
    }
    
    function moveNode(node, position) {
        position.width = position.width || +(node.attr("width"));
        position.height = position.height || +(node.attr("height"));
        if (position.x < 0) {
            position.x = 0;
        }
        if (position.y < 0) {
            position.y = 0;
        }
        if (position.x + position.width > graphSize[0]) {
            position.x = graphSize[0] - position.width;
        }
        if (position.y + position.height > graphSize[1]) {
            position.y = graphSize[1] - position.height;
        }
        node.attr("x", position.x)
            .attr("y", position.y);
        let nodeData = node.data()[0];
        nodeData.x0 = position.x
        nodeData.x1 = position.x + position.width;
        nodeData.y0 = position.y;
        nodeData.y1 = position.y + position.height;
        sankey.update(graph);
        svgLinks.selectAll("linearGradient")
                .attr("x1", d => d.source.x1)
                .attr("x2", d => d.target.x0);
        svgLinks.selectAll("path")
                .attr("d", path);
    }
    
    function onDragDragging() {
        let currentMousePosition = getMousePosition(d3.event);
        let delta = {
            x: currentMousePosition.x - initialMousePosition.x,
            y: currentMousePosition.y - initialMousePosition.y
        };
        let thisNode = d3.select(this);
        let newNodePosition = {
            x: initialNodePosition.x + delta.x,
            y: initialNodePosition.y + delta.y,
            width: initialNodePosition.width,
            height: initialNodePosition.height
        };
        moveNode(thisNode, newNodePosition);        
    }
    
    function onDragEnd() {
        let node = d3.select(this)
                     .attr("stroke-width", 0);
    }
    
    function onDragStart() {
        let node = d3.select(this)
                     .raise()
                     .attr("stroke-width", nodeStrokeWidth);
        setInitialNodePosition(node);
        initialNodePosition = getNodePosition(node);
        initialMousePosition = getMousePosition(d3.event);
    }
    
    function reduceUnique(previous, current) {
        if (previous.indexOf(current) < 0) {
            previous.push(current);
        }
        return previous;
    }
    
    function setInitialMousePosition(e) {
        initialMousePosition.x = e.x;
        initialMousePosition.y = e.y;
    }
    
    function setInitialNodePosition(node) {
        let pos = node ? getNodePosition(node) : { x: 0, y: 0, width: 0, height: 0 };
        initialNodePosition.x = pos.x;
        initialNodePosition.y = pos.y;
        initialNodePosition.width = pos.width;
        initialNodePosition.height = pos.height;
    }
        
    function sumValues(previous, current) {
        previous += current;
        return previous;
    }
    
    const data = {
        nodes: [
            { id: "W1_AB" },
            { id: "W2_AB" },
            { id: "W3_empty-DOS" },
            { id: "W1_TC" },
            { id: "W2_TC" },
            { id: "W3_TC" },
            { id: "W4_TC" },
            { id: "W5_CP-TVC" },
            { id: "W1_MC" },
            { id: "W2_MC" },
            { id: "W3_MC" },
            { id: "W4_MC" },
            { id: "W5_MC" },
            { id: "W6_CP-TVC" },
            { id: "W1_RV" },
            { id: "W2_VA-ORT" },
            { id: "W1_DA" },
            { id: "W2_RV" },
            { id: "W3_AB" },
            { id: "W4_CP-TVC" },
            { id: "W2_empty-ANN" },
            { id: "W4_DA" },
            { id: "W5_empty-ANN" },
            { id: "W2_BL-ORT" },
            { id: "W3_RV" },
            { id: "W4_RV" },
            { id: "W5_RV" },
            { id: "W5_TC" },
            { id: "W2_DA" },
            { id: "W3_DA" },
            { id: "W5_BL-PBC" },
            { id: "W2_ET" },
            { id: "W3_ET" },
            { id: "W4_ET" },
            { id: "W5_empty-ETU" },
            { id: "W1_empty" },
            { id: "W2_empty" },
            { id: "W3_empty" },
            { id: "W4_empty" },
            { id: "W5_empty" },
            { id: "W6_empty" },
            { id: "W7_BL-PBC" },
            { id: "W5_VA-ORT" },
            { id: "W4_PR-ORT" },
            { id: "W6_empty-ANN" },
            { id: "W5_empty-RRC" },
            { id: "W3_empty-PBC" },
            { id: "W4_AI-ORT" },
            { id: "W4_BL-ORT" },
            { id: "W3_BL-PBC" },
            { id: "W5_BL-REO" },
            { id: "W3_empty-ANC" },
            { id: "W1_ET" },
            { id: "W2_empty-ANC" },
            { id: "W6_VA-ORT" },
            { id: "W2_empty-DMS" },
            { id: "W4_AB" },
            { id: "W5_AB" },
            { id: "W6_empty-RMC" },
            { id: "W6_RV" },
            { id: "W7_CP-TVC" },
            { id: "W4_empty-ANN" },
            { id: "W6_empty-DFA" },
            { id: "W6_MC" },
            { id: "W3_BL-ORT" },
            { id: "W2_empty-ETU" },
            { id: "W3_empty-ANN" },
            { id: "W1_BL" },
            { id: "W2_BL" },
            { id: "W3_BL" },
            { id: "W4_BL" },
            { id: "W2_BL-PBC" },
            { id: "W5_BL" },
            { id: "W6_BL-PBC" },
            { id: "W3_AI-ORT" },
            { id: "W5_empty-DMS" },
            { id: "W2_CP-TVC" },
            { id: "W6_TC" },
            { id: "W2_PR-ORT" },
            { id: "W3_CP-TVC" },
            { id: "W5_empty-RMC" },
            { id: "W7_empty-ANN" },
            { id: "W4_empty-ETU" },
            { id: "W3_empty-DMS" },
            { id: "W3_IC-TVC" },
            { id: "W3_empty-ETU" },
            { id: "W4_BL-PBC" },
            { id: "W6_AI-ORT" },
            { id: "W2_VA-PBC" },
            { id: "W7_empty-RMC" },
            { id: "W5_PR-ORT" },
            { id: "W6_empty-PAD" },
            { id: "W3_empty-RRC" },
            { id: "W4_empty-DMS" },
            { id: "W6_AB" },
            { id: "W3_empty-RMC" },
            { id: "W6_empty-MAJ" },
            { id: "W2_GC-PBC" },
            { id: "W2_MC-PBC" },
            { id: "W1_RR" },
            { id: "W7_ET" },
            { id: "W8_empty-ANN" },
            { id: "W5_empty-ANC" },
            { id: "W7_TC" },
            { id: "W8_empty-ANC" },
            { id: "W3_PR-ORT" },
            { id: "W7_empty-ANC" },
            { id: "W4_GC-PBC" },
            { id: "W2_AI-ORT" },
            { id: "W2_RV-ORT" },
            { id: "W4_MC-PBC" },
            { id: "W2_empty-RRC" },
            { id: "W5_AI-ORT" },
            { id: "W2_empty-PAD" },
            { id: "W2_empty-RMC" },
            { id: "W3_Avez-vous un TPE ?|=Non-Avez-vous un FAX ?=Non" },
            { id: "W6_AP-ORT" },
            { id: "W6_BL" },
            { id: "W7_DA" },
            { id: "W8_empty-DMS" },
            { id: "W4_BL-ROA" },
            { id: "W3_empty-MAT" },
            { id: "W7_empty-DFA" },
            { id: "W5_DA" },
            { id: "W4_IC-TVC" },
            { id: "W2_ET-ORT" },
            { id: "W2_RR" },
            { id: "W3_RR" },
            { id: "W5_empty-DFA" },
            { id: "W7_IC-TVC" },
            { id: "W6_DA" },
            { id: "W5_MC-PBC" },
            { id: "W6_empty-ETU" },
            { id: "W2_IC-TVC" },
            { id: "W8_empty-DFA" },
            { id: "W7_RV" },
            { id: "W5_BL-ORT" },
            { id: "W7_empty-ETU" },
            { id: "W4_empty-RRC" },
            { id: "W2_empty-TOK" },
            { id: "W4_empty-ANC" },
            { id: "W4_RV-ORT" },
            { id: "W3_GC-REO" },
            { id: "W4_AP-ORT" },
            { id: "W2_RV-ETU" },
            { id: "W4_RR" },
            { id: "W5_RR" },
            { id: "W6_BL-REO" },
            { id: "W4_AU-PBC" },
            { id: "W6_EL-PBC" },
            { id: "W1_RF" },
            { id: "W7_empty" },
            { id: "W8_empty-RRC" },
            { id: "W4_empty-RMC" },
            { id: "W6_empty-SOGETREL 2015" },
            { id: "W3_GC-PBC" },
            { id: "W2_AU-PBC" },
            { id: "W3_PP-TVC" },
            { id: "W6_AU-PBC" },
            { id: "W2_empty-DOS" },
            { id: "W3_RV-ORT" },
            { id: "W6_PP-TVC" },
            { id: "W3_ET-PBC" },
            { id: "W2_ET-PBC" },
            { id: "W7_EL-PBC" },
            { id: "W5_AU-PBC" },
            { id: "W7_empty-RRC" },
            { id: "W3_AU-PBC" },
            { id: "W4_AI-REO" },
            { id: "W6_BL-ORT" },
            { id: "W5_GC-PBC" },
            { id: "W8_empty-ETU" },
            { id: "W2_BL-REO" },
            { id: "W5_ET" },
            { id: "W6_RR" },
            { id: "W7_empty-DMS" },
            { id: "W3_VA-ORT" },
            { id: "W2_empty-ORT" },
            { id: "W4_ANN-CAPCOM" },
            { id: "W5_GC-REO" },
            { id: "W3_RV-REO" },
            { id: "W4_VA-PBC" },
            { id: "W3_MC-ETU" },
            { id: "W6_empty-DMS" },
            { id: "W7_GC-PBC" },
            { id: "W5_IC-TVC" },
            { id: "W2_empty-PBC" },
            { id: "W7_BL-REO" },
            { id: "W5_PP-TVC" },
            { id: "W3_empty-SOGETREL 2015" },
            { id: "W7_AU-PBC" },
            { id: "W7_PP-TVC" },
            { id: "W3_RV-ANN" },
            { id: "W4_INEO PROD FTTH-W85" },
            { id: "W3_empty-PAD" },
            { id: "W3_ET-ORT" },
            { id: "W2_RF" },
            { id: "W3_AB-REO" },
            { id: "W3_empty-TOK" },
            { id: "W5_VA-PBC" },
            { id: "W4_VA-ORT" },
            { id: "W2_PP-TVC" },
            { id: "W4_PP-TVC" },
            { id: "W6_empty-ANC" },
            { id: "W3_BL-REO" },
            { id: "W4_empty-DFA" },
            { id: "W6_IC-TVC" },
            { id: "W2_AP-ORT" },
            { id: "W3_empty-DFA" },
            { id: "W4_empty-PBC" },
            { id: "W3_EP-TVC" },
            { id: "W3_VA-PBC" },
            { id: "W4_empty-REO" },
            { id: "W4_AB-ROA" },
            { id: "W3_PE-PBC" },
            { id: "W2_RV-ANN" },
            { id: "W2_RV-PBC" },
            { id: "W2_ANN-SOGETREL 2015" },
            { id: "W3_empty-RMF" }
        ],
        links: [
            { source: "W1_AB", target: "W2_AB", value: 270},
            { source: "W1_AB", target: "W2_DA", value: 1},
            { source: "W1_AB", target: "W2_RV", value: 14},
            { source: "W1_AB", target: "W2_empty-ANN", value: 81},
            { source: "W1_AB", target: "W2_TC", value: 3},
            { source: "W1_AB", target: "W2_empty-DMS", value: 5},
            { source: "W1_AB", target: "W2_empty-RRC", value: 3},
            { source: "W1_AB", target: "W2_empty-RMC", value: 21},
            { source: "W1_AB", target: "W2_empty-ANC", value: 4},
            { source: "W1_AB", target: "W2_empty", value: 24},
            { source: "W1_AB", target: "W2_BL-ORT", value: 2},
            { source: "W1_AB", target: "W2_CP-TVC", value: 1},
            { source: "W1_AB", target: "W2_PP-TVC", value: 1},
            { source: "W1_AB", target: "W2_MC", value: 1},
            { source: "W1_AB", target: "W2_empty-ETU", value: 3},
            { source: "W1_AB", target: "W2_VA-ORT", value: 1},
            { source: "W2_AB", target: "W3_empty-DOS", value: 1},
            { source: "W2_AB", target: "W3_AB", value: 122},
            { source: "W2_AB", target: "W3_empty-ANN", value: 112},
            { source: "W2_AB", target: "W3_TC", value: 4},
            { source: "W2_AB", target: "W3_ET", value: 1},
            { source: "W2_AB", target: "W3_empty-ANC", value: 4},
            { source: "W2_AB", target: "W3_empty-DMS", value: 2},
            { source: "W2_AB", target: "W3_RV", value: 8},
            { source: "W2_AB", target: "W3_empty", value: 7},
            { source: "W2_AB", target: "W3_empty-MAT", value: 1},
            { source: "W2_AB", target: "W3_BL-ORT", value: 2},
            { source: "W2_AB", target: "W3_empty-RMC", value: 27},
            { source: "W2_AB", target: "W3_CP-TVC", value: 4},
            { source: "W2_AB", target: "W3_MC", value: 2},
            { source: "W2_AB", target: "W3_RR", value: 1},
            { source: "W2_AB", target: "W3_IC-TVC", value: 1},
            { source: "W2_AB", target: "W3_DA", value: 1},
            { source: "W2_AB", target: "W3_AB-REO", value: 1},
            { source: "W2_AB", target: "W3_empty-ETU", value: 1},
            { source: "W2_AB", target: "W3_empty-DFA", value: 1},
            { source: "W2_AB", target: "W3_empty-RRC", value: 1},
            { source: "W2_AB", target: "W3_empty-PAD", value: 1},
            { source: "W1_TC", target: "W2_TC", value: 237},
            { source: "W1_TC", target: "W2_empty-ANN", value: 21},
            { source: "W1_TC", target: "W2_CP-TVC", value: 8},
            { source: "W1_TC", target: "W2_IC-TVC", value: 5},
            { source: "W1_TC", target: "W2_BL-ORT", value: 2},
            { source: "W1_TC", target: "W2_empty", value: 20},
            { source: "W1_TC", target: "W2_empty-ETU", value: 4},
            { source: "W1_TC", target: "W2_AB", value: 1},
            { source: "W1_TC", target: "W2_empty-ANC", value: 3},
            { source: "W1_TC", target: "W2_RV", value: 3},
            { source: "W1_TC", target: "W2_PP-TVC", value: 2},
            { source: "W1_TC", target: "W2_MC", value: 1},
            { source: "W1_TC", target: "W2_BL-REO", value: 1},
            { source: "W1_TC", target: "W2_empty-PAD", value: 1},
            { source: "W2_TC", target: "W3_TC", value: 195},
            { source: "W2_TC", target: "W3_RV", value: 2},
            { source: "W2_TC", target: "W3_empty-ANN", value: 22},
            { source: "W2_TC", target: "W3_empty", value: 16},
            { source: "W2_TC", target: "W3_BL-ORT", value: 2},
            { source: "W2_TC", target: "W3_CP-TVC", value: 20},
            { source: "W2_TC", target: "W3_empty-ETU", value: 3},
            { source: "W2_TC", target: "W3_VA-ORT", value: 1},
            { source: "W2_TC", target: "W3_PP-TVC", value: 3},
            { source: "W2_TC", target: "W3_IC-TVC", value: 2},
            { source: "W2_TC", target: "W3_AU-PBC", value: 1},
            { source: "W2_TC", target: "W3_empty-RMC", value: 1},
            { source: "W3_TC", target: "W4_TC", value: 137},
            { source: "W3_TC", target: "W4_CP-TVC", value: 38},
            { source: "W3_TC", target: "W4_empty-ANN", value: 27},
            { source: "W3_TC", target: "W4_empty-DMS", value: 1},
            { source: "W3_TC", target: "W4_IC-TVC", value: 2},
            { source: "W3_TC", target: "W4_MC", value: 1},
            { source: "W3_TC", target: "W4_empty", value: 1},
            { source: "W3_TC", target: "W4_RV", value: 2},
            { source: "W3_TC", target: "W4_empty-RRC", value: 2},
            { source: "W3_TC", target: "W4_empty-ANC", value: 1},
            { source: "W4_TC", target: "W5_CP-TVC", value: 28},
            { source: "W4_TC", target: "W5_TC", value: 69},
            { source: "W4_TC", target: "W5_empty-ANN", value: 37},
            { source: "W4_TC", target: "W5_PR-ORT", value: 1},
            { source: "W4_TC", target: "W5_VA-ORT", value: 2},
            { source: "W4_TC", target: "W5_empty-ANC", value: 2},
            { source: "W4_TC", target: "W5_MC", value: 1},
            { source: "W4_TC", target: "W5_RV", value: 1},
            { source: "W4_TC", target: "W5_empty-ETU", value: 2},
            { source: "W4_TC", target: "W5_empty", value: 1},
            { source: "W1_MC", target: "W2_MC", value: 149},
            { source: "W1_MC", target: "W2_ET", value: 2},
            { source: "W1_MC", target: "W2_RV", value: 12},
            { source: "W1_MC", target: "W2_TC", value: 4},
            { source: "W1_MC", target: "W2_BL-PBC", value: 13},
            { source: "W1_MC", target: "W2_AB", value: 5},
            { source: "W1_MC", target: "W2_empty-ANN", value: 16},
            { source: "W1_MC", target: "W2_BL-ORT", value: 13},
            { source: "W1_MC", target: "W2_BL", value: 3},
            { source: "W1_MC", target: "W2_MC-PBC", value: 1},
            { source: "W1_MC", target: "W2_PR-ORT", value: 2},
            { source: "W1_MC", target: "W2_empty", value: 6},
            { source: "W1_MC", target: "W2_AI-ORT", value: 7},
            { source: "W1_MC", target: "W2_empty-ETU", value: 4},
            { source: "W1_MC", target: "W2_VA-ORT", value: 2},
            { source: "W1_MC", target: "W2_empty-RMC", value: 3},
            { source: "W1_MC", target: "W2_AU-PBC", value: 2},
            { source: "W1_MC", target: "W2_GC-PBC", value: 1},
            { source: "W1_MC", target: "W2_empty-ANC", value: 4},
            { source: "W1_MC", target: "W2_empty-DMS", value: 3},
            { source: "W1_MC", target: "W2_CP-TVC", value: 1},
            { source: "W1_MC", target: "W2_ET-ORT", value: 1},
            { source: "W1_MC", target: "W2_VA-PBC", value: 4},
            { source: "W1_MC", target: "W2_RR", value: 1},
            { source: "W1_MC", target: "W2_empty-PAD", value: 1},
            { source: "W2_MC", target: "W3_MC", value: 105},
            { source: "W2_MC", target: "W3_empty-ANC", value: 3},
            { source: "W2_MC", target: "W3_BL-ORT", value: 5},
            { source: "W2_MC", target: "W3_AI-ORT", value: 4},
            { source: "W2_MC", target: "W3_CP-TVC", value: 1},
            { source: "W2_MC", target: "W3_empty-ANN", value: 23},
            { source: "W2_MC", target: "W3_IC-TVC", value: 1},
            { source: "W2_MC", target: "W3_empty", value: 3},
            { source: "W2_MC", target: "W3_BL-PBC", value: 4},
            { source: "W2_MC", target: "W3_empty-RRC", value: 3},
            { source: "W2_MC", target: "W3_RV", value: 3},
            { source: "W2_MC", target: "W3_AB", value: 5},
            { source: "W2_MC", target: "W3_empty-RMC", value: 2},
            { source: "W2_MC", target: "W3_VA-ORT", value: 1},
            { source: "W2_MC", target: "W3_MC-ETU", value: 1},
            { source: "W2_MC", target: "W3_empty-TOK", value: 1},
            { source: "W2_MC", target: "W3_BL", value: 1},
            { source: "W2_MC", target: "W3_empty-ETU", value: 1},
            { source: "W2_MC", target: "W3_TC", value: 2},
            { source: "W2_MC", target: "W3_AU-PBC", value: 1},
            { source: "W3_MC", target: "W4_MC", value: 72},
            { source: "W3_MC", target: "W4_DA", value: 1},
            { source: "W3_MC", target: "W4_empty", value: 2},
            { source: "W3_MC", target: "W4_empty-ANN", value: 19},
            { source: "W3_MC", target: "W4_MC-PBC", value: 1},
            { source: "W3_MC", target: "W4_BL-PBC", value: 2},
            { source: "W3_MC", target: "W4_empty-ETU", value: 1},
            { source: "W3_MC", target: "W4_empty-RMC", value: 2},
            { source: "W3_MC", target: "W4_AU-PBC", value: 2},
            { source: "W3_MC", target: "W4_RV", value: 1},
            { source: "W3_MC", target: "W4_INEO PROD FTTH-W85", value: 1},
            { source: "W3_MC", target: "W4_CP-TVC", value: 5},
            { source: "W3_MC", target: "W4_empty-ANC", value: 4},
            { source: "W3_MC", target: "W4_empty-DFA", value: 3},
            { source: "W3_MC", target: "W4_AI-ORT", value: 1},
            { source: "W4_MC", target: "W5_MC", value: 41},
            { source: "W4_MC", target: "W5_BL-PBC", value: 2},
            { source: "W4_MC", target: "W5_VA-ORT", value: 1},
            { source: "W4_MC", target: "W5_empty-DMS", value: 1},
            { source: "W4_MC", target: "W5_empty-ANN", value: 15},
            { source: "W4_MC", target: "W5_RV", value: 2},
            { source: "W4_MC", target: "W5_empty", value: 2},
            { source: "W4_MC", target: "W5_MC-PBC", value: 1},
            { source: "W4_MC", target: "W5_empty-ANC", value: 2},
            { source: "W4_MC", target: "W5_empty-ETU", value: 2},
            { source: "W4_MC", target: "W5_AI-ORT", value: 2},
            { source: "W4_MC", target: "W5_AU-PBC", value: 1},
            { source: "W4_MC", target: "W5_TC", value: 1},
            { source: "W4_MC", target: "W5_GC-PBC", value: 1},
            { source: "W4_MC", target: "W5_CP-TVC", value: 5},
            { source: "W4_MC", target: "W5_empty-RMC", value: 3},
            { source: "W4_MC", target: "W5_PP-TVC", value: 1},
            { source: "W4_MC", target: "W5_empty-RRC", value: 1},
            { source: "W5_MC", target: "W6_CP-TVC", value: 14},
            { source: "W5_MC", target: "W6_VA-ORT", value: 3},
            { source: "W5_MC", target: "W6_empty-DFA", value: 2},
            { source: "W5_MC", target: "W6_empty-ANN", value: 10},
            { source: "W5_MC", target: "W6_MC", value: 6},
            { source: "W5_MC", target: "W6_BL-PBC", value: 2},
            { source: "W5_MC", target: "W6_empty-RMC", value: 2},
            { source: "W5_MC", target: "W6_empty-SOGETREL 2015", value: 1},
            { source: "W5_MC", target: "W6_empty", value: 1},
            { source: "W5_MC", target: "W6_empty-ETU", value: 1},
            { source: "W5_MC", target: "W6_empty-PAD", value: 1},
            { source: "W1_RV", target: "W2_VA-ORT", value: 5},
            { source: "W1_RV", target: "W2_BL-ORT", value: 29},
            { source: "W1_RV", target: "W2_RV", value: 219},
            { source: "W1_RV", target: "W2_MC", value: 14},
            { source: "W1_RV", target: "W2_empty-DMS", value: 10},
            { source: "W1_RV", target: "W2_TC", value: 14},
            { source: "W1_RV", target: "W2_empty-ETU", value: 16},
            { source: "W1_RV", target: "W2_CP-TVC", value: 4},
            { source: "W1_RV", target: "W2_PR-ORT", value: 2},
            { source: "W1_RV", target: "W2_AB", value: 15},
            { source: "W1_RV", target: "W2_DA", value: 3},
            { source: "W1_RV", target: "W2_BL", value: 2},
            { source: "W1_RV", target: "W2_AI-ORT", value: 18},
            { source: "W1_RV", target: "W2_RV-ORT", value: 1},
            { source: "W1_RV", target: "W2_empty-ANN", value: 39},
            { source: "W1_RV", target: "W2_BL-PBC", value: 23},
            { source: "W1_RV", target: "W2_empty-PAD", value: 4},
            { source: "W1_RV", target: "W2_empty", value: 15},
            { source: "W1_RV", target: "W2_empty-RRC", value: 3},
            { source: "W1_RV", target: "W2_empty-TOK", value: 1},
            { source: "W1_RV", target: "W2_RV-ETU", value: 1},
            { source: "W1_RV", target: "W2_empty-ANC", value: 6},
            { source: "W1_RV", target: "W2_IC-TVC", value: 1},
            { source: "W1_RV", target: "W2_BL-REO", value: 1},
            { source: "W1_RV", target: "W2_VA-PBC", value: 2},
            { source: "W1_RV", target: "W2_ET-ORT", value: 2},
            { source: "W1_RV", target: "W2_AP-ORT", value: 2},
            { source: "W1_RV", target: "W2_empty-RMC", value: 1},
            { source: "W1_RV", target: "W2_RV-ANN", value: 1},
            { source: "W1_RV", target: "W2_RV-PBC", value: 1},
            { source: "W1_RV", target: "W2_AU-PBC", value: 1},
            { source: "W1_RV", target: "W2_GC-PBC", value: 1},
            { source: "W1_DA", target: "W2_RV", value: 8},
            { source: "W1_DA", target: "W2_empty-ANN", value: 18},
            { source: "W1_DA", target: "W2_DA", value: 45},
            { source: "W1_DA", target: "W2_GC-PBC", value: 1},
            { source: "W1_DA", target: "W2_empty-ETU", value: 2},
            { source: "W1_DA", target: "W2_BL-ORT", value: 2},
            { source: "W1_DA", target: "W2_ET-ORT", value: 1},
            { source: "W1_DA", target: "W2_empty-DMS", value: 1},
            { source: "W1_DA", target: "W2_AB", value: 1},
            { source: "W1_DA", target: "W2_empty-RRC", value: 1},
            { source: "W1_DA", target: "W2_MC", value: 1},
            { source: "W1_DA", target: "W2_empty", value: 2},
            { source: "W1_DA", target: "W2_empty-PAD", value: 1},
            { source: "W1_DA", target: "W2_empty-ANC", value: 1},
            { source: "W2_RV", target: "W3_AB", value: 8},
            { source: "W2_RV", target: "W3_RV", value: 146},
            { source: "W2_RV", target: "W3_BL-PBC", value: 11},
            { source: "W2_RV", target: "W3_MC", value: 9},
            { source: "W2_RV", target: "W3_TC", value: 5},
            { source: "W2_RV", target: "W3_empty-ANN", value: 26},
            { source: "W2_RV", target: "W3_empty", value: 6},
            { source: "W2_RV", target: "W3_empty-ETU", value: 6},
            { source: "W2_RV", target: "W3_PR-ORT", value: 1},
            { source: "W2_RV", target: "W3_AI-ORT", value: 14},
            { source: "W2_RV", target: "W3_empty-RRC", value: 2},
            { source: "W2_RV", target: "W3_Avez-vous un TPE ?|=Non-Avez-vous un FAX ?=Non", value: 1},
            { source: "W2_RV", target: "W3_BL-ORT", value: 6},
            { source: "W2_RV", target: "W3_empty-ANC", value: 6},
            { source: "W2_RV", target: "W3_empty-RMC", value: 2},
            { source: "W2_RV", target: "W3_RV-REO", value: 2},
            { source: "W2_RV", target: "W3_CP-TVC", value: 2},
            { source: "W2_RV", target: "W3_RV-ANN", value: 1},
            { source: "W2_RV", target: "W3_empty-PAD", value: 1},
            { source: "W2_RV", target: "W3_ET-ORT", value: 1},
            { source: "W2_RV", target: "W3_empty-DOS", value: 1},
            { source: "W2_RV", target: "W3_DA", value: 1},
            { source: "W2_RV", target: "W3_empty-DFA", value: 1},
            { source: "W2_RV", target: "W3_empty-RMF", value: 1},
            { source: "W3_AB", target: "W4_CP-TVC", value: 2},
            { source: "W3_AB", target: "W4_AB", value: 73},
            { source: "W3_AB", target: "W4_empty-ANN", value: 40},
            { source: "W3_AB", target: "W4_empty", value: 3},
            { source: "W3_AB", target: "W4_IC-TVC", value: 2},
            { source: "W3_AB", target: "W4_empty-ANC", value: 3},
            { source: "W3_AB", target: "W4_empty-DMS", value: 2},
            { source: "W3_AB", target: "W4_empty-RMC", value: 8},
            { source: "W3_AB", target: "W4_RV", value: 2},
            { source: "W3_AB", target: "W4_VA-ORT", value: 1},
            { source: "W3_AB", target: "W4_AI-ORT", value: 1},
            { source: "W3_AB", target: "W4_PP-TVC", value: 1},
            { source: "W3_AB", target: "W4_AB-ROA", value: 1},
            { source: "W3_AB", target: "W4_empty-ETU", value: 1},
            { source: "W4_DA", target: "W5_empty-ANN", value: 8},
            { source: "W4_DA", target: "W5_CP-TVC", value: 3},
            { source: "W4_DA", target: "W5_DA", value: 6},
            { source: "W4_DA", target: "W5_empty-ETU", value: 1},
            { source: "W4_DA", target: "W5_VA-ORT", value: 1},
            { source: "W4_DA", target: "W5_empty", value: 1},
            { source: "W4_DA", target: "W5_IC-TVC", value: 1},
            { source: "W4_DA", target: "W5_AI-ORT", value: 1},
            { source: "W3_RV", target: "W4_RV", value: 89},
            { source: "W3_RV", target: "W4_PR-ORT", value: 1},
            { source: "W3_RV", target: "W4_AI-ORT", value: 3},
            { source: "W3_RV", target: "W4_BL-ORT", value: 5},
            { source: "W3_RV", target: "W4_MC", value: 6},
            { source: "W3_RV", target: "W4_empty-ETU", value: 4},
            { source: "W3_RV", target: "W4_empty-ANN", value: 20},
            { source: "W3_RV", target: "W4_empty-DMS", value: 1},
            { source: "W3_RV", target: "W4_BL-PBC", value: 7},
            { source: "W3_RV", target: "W4_empty", value: 2},
            { source: "W3_RV", target: "W4_IC-TVC", value: 1},
            { source: "W3_RV", target: "W4_TC", value: 3},
            { source: "W3_RV", target: "W4_empty-RRC", value: 2},
            { source: "W3_RV", target: "W4_RV-ORT", value: 1},
            { source: "W3_RV", target: "W4_AP-ORT", value: 1},
            { source: "W3_RV", target: "W4_ANN-CAPCOM", value: 1},
            { source: "W3_RV", target: "W4_GC-PBC", value: 1},
            { source: "W3_RV", target: "W4_RR", value: 1},
            { source: "W3_RV", target: "W4_CP-TVC", value: 2},
            { source: "W3_RV", target: "W4_empty-DFA", value: 6},
            { source: "W3_RV", target: "W4_DA", value: 1},
            { source: "W3_RV", target: "W4_empty-RMC", value: 2},
            { source: "W3_RV", target: "W4_AB", value: 3},
            { source: "W4_RV", target: "W5_RV", value: 50},
            { source: "W4_RV", target: "W5_empty-ANN", value: 16},
            { source: "W4_RV", target: "W5_CP-TVC", value: 1},
            { source: "W4_RV", target: "W5_empty-ETU", value: 3},
            { source: "W4_RV", target: "W5_AB", value: 4},
            { source: "W4_RV", target: "W5_BL-PBC", value: 6},
            { source: "W4_RV", target: "W5_empty-DFA", value: 4},
            { source: "W4_RV", target: "W5_AI-ORT", value: 2},
            { source: "W4_RV", target: "W5_BL-ORT", value: 2},
            { source: "W4_RV", target: "W5_MC", value: 1},
            { source: "W4_RV", target: "W5_GC-PBC", value: 1},
            { source: "W4_RV", target: "W5_TC", value: 2},
            { source: "W4_RV", target: "W5_empty", value: 1},
            { source: "W4_RV", target: "W5_empty-ANC", value: 2},
            { source: "W4_RV", target: "W5_empty-RRC", value: 1},
            { source: "W4_RV", target: "W5_empty-RMC", value: 1},
            { source: "W5_RV", target: "W6_CP-TVC", value: 4},
            { source: "W5_RV", target: "W6_empty-ANN", value: 16},
            { source: "W5_RV", target: "W6_RV", value: 17},
            { source: "W5_RV", target: "W6_empty", value: 2},
            { source: "W5_RV", target: "W6_empty-MAJ", value: 1},
            { source: "W5_RV", target: "W6_MC", value: 2},
            { source: "W5_RV", target: "W6_empty-DFA", value: 4},
            { source: "W5_RV", target: "W6_empty-ETU", value: 3},
            { source: "W5_RV", target: "W6_TC", value: 1},
            { source: "W5_RV", target: "W6_BL-ORT", value: 1},
            { source: "W5_RV", target: "W6_empty-RMC", value: 1},
            { source: "W5_RV", target: "W6_BL-PBC", value: 1},
            { source: "W5_RV", target: "W6_AB", value: 1},
            { source: "W5_RV", target: "W6_empty-DMS", value: 1},
            { source: "W5_TC", target: "W6_CP-TVC", value: 23},
            { source: "W5_TC", target: "W6_TC", value: 18},
            { source: "W5_TC", target: "W6_empty-ANN", value: 29},
            { source: "W5_TC", target: "W6_empty", value: 1},
            { source: "W5_TC", target: "W6_empty-PAD", value: 1},
            { source: "W2_DA", target: "W3_DA", value: 32},
            { source: "W2_DA", target: "W3_empty-PBC", value: 1},
            { source: "W2_DA", target: "W3_empty", value: 1},
            { source: "W2_DA", target: "W3_AB", value: 1},
            { source: "W2_DA", target: "W3_empty-ANN", value: 6},
            { source: "W2_DA", target: "W3_empty-DMS", value: 2},
            { source: "W2_DA", target: "W3_RV", value: 1},
            { source: "W2_DA", target: "W3_AI-ORT", value: 1},
            { source: "W2_DA", target: "W3_IC-TVC", value: 1},
            { source: "W2_DA", target: "W3_BL-PBC", value: 1},
            { source: "W2_DA", target: "W3_BL-ORT", value: 2},
            { source: "W3_DA", target: "W4_DA", value: 20},
            { source: "W3_DA", target: "W4_BL", value: 1},
            { source: "W3_DA", target: "W4_IC-TVC", value: 4},
            { source: "W3_DA", target: "W4_empty-ANN", value: 2},
            { source: "W3_DA", target: "W4_AB", value: 1},
            { source: "W3_DA", target: "W4_empty", value: 2},
            { source: "W3_DA", target: "W4_empty-RRC", value: 1},
            { source: "W3_DA", target: "W4_empty-DMS", value: 1},
            { source: "W3_DA", target: "W4_empty-ANC", value: 1},
            { source: "W3_DA", target: "W4_PP-TVC", value: 2},
            { source: "W2_ET", target: "W3_ET", value: 16},
            { source: "W2_ET", target: "W3_VA-ORT", value: 1},
            { source: "W2_ET", target: "W3_empty-ANN", value: 1},
            { source: "W2_ET", target: "W3_empty-ETU", value: 4},
            { source: "W2_ET", target: "W3_BL-PBC", value: 1},
            { source: "W2_ET", target: "W3_BL-ORT", value: 1},
            { source: "W3_ET", target: "W4_ET", value: 13},
            { source: "W3_ET", target: "W4_empty-ETU", value: 4},
            { source: "W3_ET", target: "W4_BL", value: 1},
            { source: "W4_ET", target: "W5_empty-ETU", value: 8},
            { source: "W4_ET", target: "W5_ET", value: 2},
            { source: "W4_ET", target: "W5_VA-ORT", value: 1},
            { source: "W4_ET", target: "W5_GC-REO", value: 1},
            { source: "W4_ET", target: "W5_empty-ANN", value: 1},
            { source: "W1_empty", target: "W2_empty", value: 138},
            { source: "W1_empty", target: "W2_empty-RMC", value: 21},
            { source: "W1_empty", target: "W2_empty-ANN", value: 17},
            { source: "W1_empty", target: "W2_empty-PAD", value: 3},
            { source: "W1_empty", target: "W2_MC", value: 3},
            { source: "W1_empty", target: "W2_RV", value: 4},
            { source: "W1_empty", target: "W2_AI-ORT", value: 4},
            { source: "W1_empty", target: "W2_AB", value: 13},
            { source: "W1_empty", target: "W2_BL", value: 2},
            { source: "W1_empty", target: "W2_empty-ETU", value: 10},
            { source: "W1_empty", target: "W2_AU-PBC", value: 4},
            { source: "W1_empty", target: "W2_empty-DOS", value: 1},
            { source: "W1_empty", target: "W2_ET-PBC", value: 1},
            { source: "W1_empty", target: "W2_BL-ORT", value: 10},
            { source: "W1_empty", target: "W2_empty-RRC", value: 3},
            { source: "W1_empty", target: "W2_empty-ORT", value: 1},
            { source: "W1_empty", target: "W2_empty-DMS", value: 2},
            { source: "W1_empty", target: "W2_empty-ANC", value: 9},
            { source: "W1_empty", target: "W2_TC", value: 10},
            { source: "W1_empty", target: "W2_empty-PBC", value: 1},
            { source: "W1_empty", target: "W2_CP-TVC", value: 11},
            { source: "W1_empty", target: "W2_BL-PBC", value: 5},
            { source: "W1_empty", target: "W2_PP-TVC", value: 4},
            { source: "W1_empty", target: "W2_AP-ORT", value: 1},
            { source: "W1_empty", target: "W2_VA-ORT", value: 2},
            { source: "W1_empty", target: "W2_IC-TVC", value: 1},
            { source: "W1_empty", target: "W2_ANN-SOGETREL 2015", value: 1},
            { source: "W2_empty", target: "W3_empty", value: 98},
            { source: "W2_empty", target: "W3_empty-RMC", value: 31},
            { source: "W2_empty", target: "W3_BL-ORT", value: 3},
            { source: "W2_empty", target: "W3_AI-ORT", value: 1},
            { source: "W2_empty", target: "W3_RV", value: 3},
            { source: "W2_empty", target: "W3_empty-PBC", value: 3},
            { source: "W2_empty", target: "W3_AB", value: 3},
            { source: "W2_empty", target: "W3_TC", value: 5},
            { source: "W2_empty", target: "W3_empty-DMS", value: 3},
            { source: "W2_empty", target: "W3_GC-PBC", value: 1},
            { source: "W2_empty", target: "W3_CP-TVC", value: 18},
            { source: "W2_empty", target: "W3_empty-ANN", value: 8},
            { source: "W2_empty", target: "W3_PP-TVC", value: 2},
            { source: "W2_empty", target: "W3_RV-ORT", value: 1},
            { source: "W2_empty", target: "W3_ET-PBC", value: 1},
            { source: "W2_empty", target: "W3_BL", value: 2},
            { source: "W2_empty", target: "W3_empty-ETU", value: 8},
            { source: "W2_empty", target: "W3_AU-PBC", value: 4},
            { source: "W2_empty", target: "W3_DA", value: 1},
            { source: "W2_empty", target: "W3_VA-ORT", value: 1},
            { source: "W2_empty", target: "W3_empty-RRC", value: 3},
            { source: "W2_empty", target: "W3_empty-SOGETREL 2015", value: 2},
            { source: "W2_empty", target: "W3_ET", value: 1},
            { source: "W2_empty", target: "W3_MC", value: 1},
            { source: "W2_empty", target: "W3_BL-PBC", value: 3},
            { source: "W2_empty", target: "W3_empty-PAD", value: 1},
            { source: "W2_empty", target: "W3_BL-REO", value: 1},
            { source: "W2_empty", target: "W3_EP-TVC", value: 1},
            { source: "W2_empty", target: "W3_IC-TVC", value: 2},
            { source: "W2_empty", target: "W3_PE-PBC", value: 1},
            { source: "W2_empty", target: "W3_empty-ANC", value: 2},
            { source: "W2_empty", target: "W3_empty-RMF", value: 1},
            { source: "W3_empty", target: "W4_empty", value: 63},
            { source: "W3_empty", target: "W4_CP-TVC", value: 17},
            { source: "W3_empty", target: "W4_MC", value: 5},
            { source: "W3_empty", target: "W4_empty-ANN", value: 7},
            { source: "W3_empty", target: "W4_GC-PBC", value: 1},
            { source: "W3_empty", target: "W4_AI-ORT", value: 2},
            { source: "W3_empty", target: "W4_AB", value: 4},
            { source: "W3_empty", target: "W4_empty-DMS", value: 8},
            { source: "W3_empty", target: "W4_empty-ETU", value: 6},
            { source: "W3_empty", target: "W4_AU-PBC", value: 1},
            { source: "W3_empty", target: "W4_TC", value: 3},
            { source: "W3_empty", target: "W4_empty-RMC", value: 6},
            { source: "W3_empty", target: "W4_AI-REO", value: 1},
            { source: "W3_empty", target: "W4_BL-ORT", value: 1},
            { source: "W3_empty", target: "W4_AP-ORT", value: 1},
            { source: "W3_empty", target: "W4_empty-ANC", value: 1},
            { source: "W3_empty", target: "W4_PP-TVC", value: 2},
            { source: "W3_empty", target: "W4_empty-PBC", value: 1},
            { source: "W3_empty", target: "W4_RV", value: 1},
            { source: "W3_empty", target: "W4_BL-PBC", value: 1},
            { source: "W3_empty", target: "W4_empty-REO", value: 1},
            { source: "W3_empty", target: "W4_IC-TVC", value: 1},
            { source: "W4_empty", target: "W5_empty", value: 29},
            { source: "W4_empty", target: "W5_empty-RRC", value: 2},
            { source: "W4_empty", target: "W5_BL-REO", value: 1},
            { source: "W4_empty", target: "W5_AI-ORT", value: 2},
            { source: "W4_empty", target: "W5_empty-ANN", value: 2},
            { source: "W4_empty", target: "W5_CP-TVC", value: 17},
            { source: "W4_empty", target: "W5_empty-ETU", value: 4},
            { source: "W4_empty", target: "W5_BL-PBC", value: 2},
            { source: "W4_empty", target: "W5_empty-RMC", value: 5},
            { source: "W4_empty", target: "W5_VA-ORT", value: 1},
            { source: "W4_empty", target: "W5_RV", value: 1},
            { source: "W4_empty", target: "W5_IC-TVC", value: 3},
            { source: "W4_empty", target: "W5_PP-TVC", value: 2},
            { source: "W4_empty", target: "W5_VA-PBC", value: 1},
            { source: "W4_empty", target: "W5_empty-ANC", value: 1},
            { source: "W5_empty", target: "W6_empty", value: 14},
            { source: "W5_empty", target: "W6_AI-ORT", value: 2},
            { source: "W5_empty", target: "W6_AP-ORT", value: 1},
            { source: "W5_empty", target: "W6_empty-RMC", value: 3},
            { source: "W5_empty", target: "W6_EL-PBC", value: 1},
            { source: "W5_empty", target: "W6_empty-ETU", value: 4},
            { source: "W5_empty", target: "W6_CP-TVC", value: 5},
            { source: "W5_empty", target: "W6_AU-PBC", value: 1},
            { source: "W5_empty", target: "W6_PP-TVC", value: 1},
            { source: "W5_empty", target: "W6_empty-ANN", value: 1},
            { source: "W5_empty", target: "W6_VA-ORT", value: 1},
            { source: "W5_empty", target: "W6_BL-PBC", value: 2},
            { source: "W5_empty", target: "W6_empty-ANC", value: 1},
            { source: "W6_empty", target: "W7_BL-PBC", value: 3},
            { source: "W6_empty", target: "W7_empty-ANN", value: 4},
            { source: "W6_empty", target: "W7_empty-RMC", value: 2},
            { source: "W6_empty", target: "W7_empty", value: 2},
            { source: "W6_empty", target: "W7_empty-ETU", value: 3},
            { source: "W6_empty", target: "W7_CP-TVC", value: 3},
            { source: "W6_empty", target: "W7_EL-PBC", value: 1},
            { source: "W6_empty", target: "W7_empty-RRC", value: 1},
            { source: "W6_empty", target: "W7_GC-PBC", value: 1},
            { source: "W6_empty", target: "W7_BL-REO", value: 1},
            { source: "W6_empty", target: "W7_AU-PBC", value: 1},
            { source: "W1_ET", target: "W2_empty-ANC", value: 1},
            { source: "W1_ET", target: "W2_ET", value: 22},
            { source: "W1_ET", target: "W2_empty-PAD", value: 3},
            { source: "W1_ET", target: "W2_empty-ETU", value: 5},
            { source: "W1_ET", target: "W2_RR", value: 1},
            { source: "W1_ET", target: "W2_empty", value: 7},
            { source: "W1_ET", target: "W2_BL-ORT", value: 7},
            { source: "W1_ET", target: "W2_VA-ORT", value: 2},
            { source: "W1_ET", target: "W2_IC-TVC", value: 1},
            { source: "W1_ET", target: "W2_BL-PBC", value: 1},
            { source: "W1_ET", target: "W2_AP-ORT", value: 1},
            { source: "W4_AB", target: "W5_AB", value: 24},
            { source: "W4_AB", target: "W5_empty-ANN", value: 35},
            { source: "W4_AB", target: "W5_empty-RMC", value: 13},
            { source: "W4_AB", target: "W5_empty-RRC", value: 2},
            { source: "W4_AB", target: "W5_empty-ETU", value: 1},
            { source: "W4_AB", target: "W5_empty", value: 2},
            { source: "W4_AB", target: "W5_empty-ANC", value: 1},
            { source: "W4_AB", target: "W5_CP-TVC", value: 2},
            { source: "W4_AB", target: "W5_empty-DFA", value: 1},
            { source: "W4_AB", target: "W5_BL-PBC", value: 1},
            { source: "W5_AB", target: "W6_empty-RMC", value: 8},
            { source: "W5_AB", target: "W6_AB", value: 3},
            { source: "W5_AB", target: "W6_CP-TVC", value: 3},
            { source: "W5_AB", target: "W6_empty-ANN", value: 6},
            { source: "W5_AB", target: "W6_RV", value: 2},
            { source: "W5_AB", target: "W6_empty-DFA", value: 2},
            { source: "W5_AB", target: "W6_empty-DMS", value: 1},
            { source: "W5_AB", target: "W6_EL-PBC", value: 1},
            { source: "W5_AB", target: "W6_empty", value: 1},
            { source: "W5_AB", target: "W6_BL-PBC", value: 1},
            { source: "W5_AB", target: "W6_IC-TVC", value: 1},
            { source: "W6_RV", target: "W7_CP-TVC", value: 1},
            { source: "W6_RV", target: "W7_ET", value: 1},
            { source: "W6_RV", target: "W7_empty-ANN", value: 6},
            { source: "W6_RV", target: "W7_empty-DFA", value: 6},
            { source: "W6_RV", target: "W7_IC-TVC", value: 1},
            { source: "W6_RV", target: "W7_RV", value: 1},
            { source: "W6_RV", target: "W7_empty-ETU", value: 1},
            { source: "W6_RV", target: "W7_PP-TVC", value: 1},
            { source: "W6_RV", target: "W7_empty-DMS", value: 1},
            { source: "W6_MC", target: "W7_CP-TVC", value: 1},
            { source: "W6_MC", target: "W7_empty-RMC", value: 2},
            { source: "W6_MC", target: "W7_empty-ANN", value: 4},
            { source: "W6_MC", target: "W7_empty-ANC", value: 1},
            { source: "W1_BL", target: "W2_BL", value: 61},
            { source: "W1_BL", target: "W2_PR-ORT", value: 1},
            { source: "W1_BL", target: "W2_BL-ORT", value: 13},
            { source: "W1_BL", target: "W2_BL-PBC", value: 12},
            { source: "W1_BL", target: "W2_VA-PBC", value: 3},
            { source: "W1_BL", target: "W2_empty-ANN", value: 3},
            { source: "W1_BL", target: "W2_empty-ETU", value: 1},
            { source: "W1_BL", target: "W2_MC", value: 1},
            { source: "W1_BL", target: "W2_empty", value: 3},
            { source: "W1_BL", target: "W2_empty-DMS", value: 1},
            { source: "W1_BL", target: "W2_VA-ORT", value: 2},
            { source: "W2_BL", target: "W3_BL", value: 50},
            { source: "W2_BL", target: "W3_BL-ORT", value: 3},
            { source: "W2_BL", target: "W3_BL-PBC", value: 6},
            { source: "W2_BL", target: "W3_empty", value: 2},
            { source: "W2_BL", target: "W3_AI-ORT", value: 1},
            { source: "W2_BL", target: "W3_empty-RMC", value: 1},
            { source: "W2_BL", target: "W3_empty-ETU", value: 1},
            { source: "W2_BL", target: "W3_VA-PBC", value: 1},
            { source: "W2_BL", target: "W3_empty-DFA", value: 1},
            { source: "W2_BL", target: "W3_AB", value: 1},
            { source: "W2_BL", target: "W3_empty-ANC", value: 1},
            { source: "W3_BL", target: "W4_BL", value: 29},
            { source: "W3_BL", target: "W4_BL-PBC", value: 18},
            { source: "W3_BL", target: "W4_BL-ROA", value: 1},
            { source: "W3_BL", target: "W4_AB", value: 1},
            { source: "W3_BL", target: "W4_BL-ORT", value: 2},
            { source: "W3_BL", target: "W4_RV", value: 1},
            { source: "W3_BL", target: "W4_empty-ANN", value: 1},
            { source: "W4_BL", target: "W5_VA-ORT", value: 2},
            { source: "W4_BL", target: "W5_BL", value: 13},
            { source: "W4_BL", target: "W5_BL-PBC", value: 9},
            { source: "W4_BL", target: "W5_PR-ORT", value: 1},
            { source: "W4_BL", target: "W5_RV", value: 1},
            { source: "W4_BL", target: "W5_empty-ANN", value: 1},
            { source: "W4_BL", target: "W5_empty", value: 1},
            { source: "W4_BL", target: "W5_BL-ORT", value: 1},
            { source: "W4_BL", target: "W5_empty-ETU", value: 1},
            { source: "W4_BL", target: "W5_CP-TVC", value: 1},
            { source: "W5_BL", target: "W6_BL-PBC", value: 2},
            { source: "W5_BL", target: "W6_empty-ANN", value: 2},
            { source: "W5_BL", target: "W6_empty-PAD", value: 1},
            { source: "W5_BL", target: "W6_VA-ORT", value: 1},
            { source: "W5_BL", target: "W6_CP-TVC", value: 1},
            { source: "W5_BL", target: "W6_BL", value: 2},
            { source: "W5_BL", target: "W6_BL-REO", value: 1},
            { source: "W5_BL", target: "W6_empty", value: 3},
            { source: "W6_TC", target: "W7_CP-TVC", value: 6},
            { source: "W6_TC", target: "W7_TC", value: 1},
            { source: "W6_TC", target: "W7_empty-ANN", value: 12},
            { source: "W6_AB", target: "W7_empty-RMC", value: 1},
            { source: "W6_AB", target: "W7_empty-ANN", value: 2},
            { source: "W6_AB", target: "W7_IC-TVC", value: 1},
            { source: "W1_RR", target: "W2_empty-ETU", value: 1},
            { source: "W1_RR", target: "W2_BL-ORT", value: 5},
            { source: "W1_RR", target: "W2_RR", value: 19},
            { source: "W1_RR", target: "W2_GC-PBC", value: 3},
            { source: "W7_ET", target: "W8_empty-ANN", value: 1},
            { source: "W7_TC", target: "W8_empty-ANC", value: 1},
            { source: "W6_BL", target: "W7_DA", value: 1},
            { source: "W6_BL", target: "W7_empty-ANN", value: 1},
            { source: "W7_DA", target: "W8_empty-DMS", value: 1},
            { source: "W7_DA", target: "W8_empty-DFA", value: 1},
            { source: "W5_DA", target: "W6_empty-ANN", value: 2},
            { source: "W5_DA", target: "W6_DA", value: 3},
            { source: "W5_DA", target: "W6_empty-DFA", value: 1},
            { source: "W2_RR", target: "W3_RR", value: 13},
            { source: "W2_RR", target: "W3_GC-REO", value: 1},
            { source: "W2_RR", target: "W3_PP-TVC", value: 1},
            { source: "W2_RR", target: "W3_empty-ANN", value: 1},
            { source: "W2_RR", target: "W3_BL-ORT", value: 2},
            { source: "W2_RR", target: "W3_empty-ETU", value: 1},
            { source: "W2_RR", target: "W3_empty", value: 1},
            { source: "W2_RR", target: "W3_TC", value: 1},
            { source: "W3_RR", target: "W4_BL-ORT", value: 1},
            { source: "W3_RR", target: "W4_RR", value: 7},
            { source: "W3_RR", target: "W4_RV", value: 1},
            { source: "W3_RR", target: "W4_TC", value: 1},
            { source: "W3_RR", target: "W4_VA-PBC", value: 1},
            { source: "W3_RR", target: "W4_empty-ANN", value: 2},
            { source: "W3_RR", target: "W4_BL-PBC", value: 1},
            { source: "W6_DA", target: "W7_empty-ANN", value: 2},
            { source: "W6_DA", target: "W7_DA", value: 1},
            { source: "W7_RV", target: "W8_empty-ANN", value: 1},
            { source: "W4_RR", target: "W5_RR", value: 3},
            { source: "W4_RR", target: "W5_empty-RMC", value: 1},
            { source: "W4_RR", target: "W5_AB", value: 1},
            { source: "W4_RR", target: "W5_GC-REO", value: 1},
            { source: "W4_RR", target: "W5_GC-PBC", value: 1},
            { source: "W4_RR", target: "W5_empty-ETU", value: 1},
            { source: "W5_RR", target: "W6_empty-ANN", value: 1},
            { source: "W5_RR", target: "W6_CP-TVC", value: 1},
            { source: "W5_RR", target: "W6_RR", value: 1},
            { source: "W1_RF", target: "W2_empty", value: 1},
            { source: "W1_RF", target: "W2_RF", value: 2},
            { source: "W1_RF", target: "W2_empty-ANN", value: 1},
            { source: "W1_RF", target: "W2_empty-ETU", value: 1},
            { source: "W7_empty", target: "W8_empty-RRC", value: 1},
            { source: "W7_empty", target: "W8_empty-ETU", value: 1},
            { source: "W5_ET", target: "W6_empty-ETU", value: 2},
            { source: "W6_RR", target: "W7_empty-DMS", value: 1},
            { source: "W2_RF", target: "W3_empty-ANN", value: 1},
            { source: "W2_RF", target: "W3_empty-PAD", value: 1}
        ]
    }

    const svg = d3.select("#canvas")
                  .attr("width", width)
                  .attr("height", height)
                  .style("background-color", svgBackground)
                  .style("border", svgBorder)
                  .append("g")
                  .attr("transform", `translate(${margin},${margin})`);
    
    // Define our sankey instance.
    const graphSize = [width - 2*margin, height - 2*margin];
    const sankey = d3.sankey()
                     .size(graphSize)
                     .nodeId(d => d.id)
                     .nodeWidth(nodeWidth)
                     .nodePadding(nodePadding)
                     .nodeAlign(nodeAlignment);
    let graph = sankey(data);
    
    // Loop through the nodes. Set additional properties to make a few things
    // easier to deal with later.
    graph.nodes.forEach(node => {
        let fillColor = color(node.index);
        node.fillColor = fillColor;
        node.strokeColor = darkenColor(fillColor, nodeDarkenFactor);
        node.width = node.x1 - node.x0;
        node.height = node.y1 - node.y0;
    });
    
    // Build the links.
    let svgLinks = svg.append("g")
                      .classed("links", true)
                      .selectAll("g")
                      .data(graph.links)
                      .enter()
                      .append("g");
    let gradients = svgLinks.append("linearGradient")
                            .attr("gradientUnits", "userSpaceOnUse")
                            .attr("x1", d => d.source.x1)
                            .attr("x2", d => d.target.x0)
                            .attr("id", d => getGradientId(d));
    addGradientStop(gradients, 0.0, d => color(d.source.index));
    addGradientStop(gradients, 1.0, d => color(d.target.index));
    svgLinks.append("path")
            .classed("link", true)
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", d => `url(#${getGradientId(d)})`)
            .attr("stroke-width", d => Math.max(1.0, d.width))
            .attr("stroke-opacity", linkOpacity);
    
    // Add hover effect to links.
    svgLinks.append("title")
            .text(d => `${d.source.id} ${arrow} ${d.target.id}\n${d.value}`);

    let svgNodes = svg.append("g")
                      .classed("nodes", true)
                      .selectAll("rect")
                      .data(graph.nodes)
                      .enter()
                      .append("rect")
                      .classed("node", true)
                      .attr("x", d => d.x0)
                      .attr("y", d => d.y0)
                      .attr("width", d => d.width)
                      .attr("height", d => d.height)
                      .attr("fill", d => d.fillColor)
                      .attr("opacity", nodeOpacity)
                      .attr("stroke", d => d.strokeColor)
                      .attr("stroke-width", 0);
    
    let nodeDepths = graph.nodes
        .map(n => n.depth)
        .reduce(reduceUnique, []);
    
    nodeDepths.forEach(d => {
        let nodesAtThisDepth = graph.nodes.filter(n => n.depth === d);
        let numberOfNodes = nodesAtThisDepth.length;
        let totalHeight = nodesAtThisDepth
                            .map(n => n.height)
                            .reduce(sumValues, 0);
        let whitespace = graphSize[1] - totalHeight;
        let balancedWhitespace = whitespace / (numberOfNodes + 1.0);
        console.log("depth", d, "total height", totalHeight, "whitespace", whitespace, "balanced whitespace", balancedWhitespace);
    });
    
    // Add hover effect to nodes.
    svgNodes.append("title")
            .text(d => `${d.id}\n${d.value} unit(s)`);
    
    svgNodes.append("text")
            .text(d => `${d.id}\n${d.value} unit(s)`);
            
    svgNodes.call(d3.drag()
                    .on("start", onDragStart)
                    .on("drag", onDragDragging)
                    .on("end", onDragEnd));

    console.log("sankey1.js loaded.");
})();
