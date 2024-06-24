import { dijkstra_2, lab, Node } from "./modules/algorithm.mjs";
import map from "./maps/map.1.mjs";

// Get these from inspect element
const LAB_WIDTH = 900;
const LAB_HEIGHT = 700;
const NODE_WIDTH = 20;
const NODE_HEIGHT = 20;

const connections_drawing = [];

// We want to wait for the html to fully parse before we start manipulating it
document.addEventListener("DOMContentLoaded", (event) => {
  const lab_map = document.getElementById("lab-map");
  const canvas = document.getElementById("lab-canvas");
  canvas.height = LAB_HEIGHT;
  canvas.width = LAB_WIDTH;

  
  const ctx = canvas.getContext("2d");
  
  load_map();

  document.getElementById("connect-btn").addEventListener("click", handle_connect);
  document.getElementById("dump-btn").addEventListener("click", dump);
  document
    .getElementById("djikstra-btn")
    .addEventListener("click", run_djikstra);
  // document.getElementById("load-btn").addEventListener("click", load_map);


  function create_node_html(node) {
    const node_html = document.createElement("div");
    const { id, x, y } = node;

    // Relative positioning for scaling purposes
    // const x_rel = (x - NODE_WIDTH / 2) / LAB_WIDTH;
    // const y_rel = (y - NODE_HEIGHT / 2) / LAB_HEIGHT;
    node_html.classList.add("node");
    node_html.style.left = `${x - NODE_WIDTH / 2}px`;
    node_html.style.top = `${y - NODE_HEIGHT / 2}px`;
    node_html.style.height = `${NODE_HEIGHT}px`;
    node_html.style.width = `${NODE_WIDTH}px`;
    const text = document.createElement("p");
    node_html.id = `node_${id}`;
    text.innerText = `(id: ${id}, x: ${Math.round(x)}, y: ${Math.round(
      y
    )})`;
    node_html.appendChild(text);

    node.attach_ref(node_html);
    lab_map.appendChild(node_html);
  }

  function create_node_backend(x, y) {
    // const node_html = document.createElement("div");


    const node_id = String(lab.nodes.length + 1);
    // Relative positioning for scaling purposes
    // const x_rel = (x - NODE_WIDTH / 2) / LAB_WIDTH;
    // const y_rel = (y - NODE_HEIGHT / 2) / LAB_HEIGHT;
    // node_html.classList.add("node");
    // node_html.style.left = `${x - NODE_WIDTH / 2}px`;
    // node_html.style.top = `${y - NODE_HEIGHT / 2}px`;
    // node_html.style.height = `${NODE_HEIGHT}px`;
    // node_html.style.width = `${NODE_WIDTH}px`;
    // const text = document.createElement("p");
    // //const node_id = String(lab.nodes.length + 1);
    // node_html.id = `node_${node_id}`;
    // text.innerText = `(id: ${node_id}, x: ${Math.round(x)}, y: ${Math.round(
    //   y
    // )})`;
    // node_html.appendChild(text);

    // Adds node to the algorithm
    const node = new Node({id: node_id, x, y});
    console.log("Node Added!", node);
    lab.add_node(node);
    create_node_html(node);
  }

  lab_map.addEventListener("click", (e) => {
    // Get the target
    const target = e.currentTarget;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position (relative to the bounding box)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    create_node_backend(x, y);
  });

  // Handle connect button click;
  function handle_connect() {
    const from_node = lab.get_node(document.getElementById("from-node").value);
    const to_node = lab.get_node(document.getElementById("to-node").value);
    connect_nodes(ctx, from_node, to_node);
  }

  function run_djikstra() {
    // Clears old path
    clear_path_drawing();
    // Reset all node colorings
    for (const nid of lab.nodes) {
      const node = lab.get_node(nid);
      if (node.ref.style.backgroundColor === "gold") {
        node.ref.style.backgroundColor = "#171717";
      }
    }

    const from_node = lab.get_node(document.getElementById("from-node").value);
    const to_node = lab.get_node(document.getElementById("to-node").value);
    const result = dijkstra_2(lab.graph, from_node.id, to_node.id);
    console.log(result);

    // This way we can look at the curr and next node and raw line
    for (let i = 0; i < result.path.length - 1; i++) {
      const curr_node = lab.get_node(result.path[i]);
      const next_node = lab.get_node(result.path[i + 1]);
      curr_node.ref.style.backgroundColor = "gold";
      next_node.ref.style.backgroundColor = "gold";

      ctx.strokeStyle = "gold";
      ctx.lineWidth = 3;
      draw_line(ctx, curr_node.x, curr_node.y, next_node.x, next_node.y);
    }
  }

  // Redraws the connections in the graph between the nodes 
  function clear_path_drawing() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    // Redraws connections between points 
    for (const line of connections_drawing) {
      draw_line(ctx, line.x1, line.y1, line.x2, line.y2);
    }
  }

  function load_map() {
    // Loads the backend with the raw data 
    lab.load(map.graph, map.nodes);

    // Populates the screen with the nodes and the connections between the nodes 
    for (const nid of lab.nodes) {
      // Attaches a class to the node
      lab.node_mappings[nid] = new Node(lab.node_mappings[nid]);
      const node = lab.get_node(nid);
      create_node_html(node);

      for (const neighbor of Object.keys(lab.graph[nid])) {
        const to_node = lab.get_node(neighbor);

        draw_line(ctx, node.x, node.y, to_node.x, to_node.y);
        connections_drawing.push({x1: node.x, y1: node.y, x2: to_node.x, y2: to_node.y});
      }
    }
  }
});

// Dumps information about the nodes
function dump() {
  console.log("Adjacency List: ", lab.graph);
  console.log("node_id -> node", lab.node_mappings);
  const data = {
    nodes: lab.node_mappings,
    graph: lab.graph
  }

  const new_window = window.open("", "_blank");
  new_window.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Hello World</title>
                </head>
                <body>
                  ${JSON.stringify(data)}
                </body>
                </html>
            `);
  new_window.document.close();
}

function draw_line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.stroke();
}

// Backend-only 
function connect_nodes(ctx, from_node, to_node) {
    // Connect the nodes in the backend
    const distance = lab.connect(from_node, to_node);
    console.log(
      "Connected nodes ",
      from_node.id,
      " and ",
      to_node.id,
      " and the distance is ",
      distance
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    draw_line(ctx, from_node.x, from_node.y, to_node.x, to_node.y);
    connections_drawing.push({x1: from_node.x, y1: from_node.y, x2: to_node.x, y2: to_node.y});
}