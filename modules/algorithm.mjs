import { calc_euclidian_distance, PriorityQueue } from "../util.mjs";

export class Node {
  constructor(id, x, y, ref = null) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.ref = ref;
  }
}

class Graph {
  constructor() {
    this.graph = {};
    this.node_mappings = {};
  }

  // Of type Node
  add_node(node) {
    this.node_mappings[node.id] = node;
    this.graph[node.id] = {};
  }

  // Undirected connection with weight (weight = distance)
  connect(node_1, node_2) {
    if (node_1.id in this.graph[node_2.id]) {
      console.error("Node Connection exists already!");
      return;
    } else if (node_1.id === node_2.id) {
      console.error("You can not connect a node to itself");
      return;
    }

    // Calculate the distance via euclidian formula
    const distance = calc_euclidian_distance(
      node_1.x,
      node_1.y,
      node_2.x,
      node_2.y
    );
    this.graph[node_1.id][node_2.id] = distance;
    this.graph[node_2.id][node_1.id] = distance;

    return distance;
  }

  get_node_adj(node) {
    return this.graph[node.id];
  }

  get_node(nid) {
    return this.node_mappings[nid];
  }

  get nodes() {
    return Object.keys(this.graph);
  }
}

export const lab = new Graph();
// Shortest path algorithm 
export function dijkstra_2(graph, startNode, targetNode) {
  const distances = {};
  const pq = new PriorityQueue();
  const previous = {};
  const path = [];

  // Initialize distances and priority queue
  for (let node in graph) {
    if (node === startNode) {
      distances[node] = 0;
      pq.enqueue([node, 0]);
    } else {
      distances[node] = Infinity;
      pq.enqueue([node, Infinity]);
    }
    previous[node] = null;
  }

  while (!pq.isEmpty()) {
    const [currentNode, currentDistance] = pq.dequeue();

    if (currentNode === targetNode) {
      // Reconstruct the shortest path
      let step = targetNode;
      while (step) {
        path.unshift(step);
        step = previous[step];
      }
      break;
    }

    for (let neighbor in graph[currentNode]) {
      const newDistance = currentDistance + graph[currentNode][neighbor];

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentNode;
        pq.enqueue([neighbor, newDistance]);
      }
    }
  }

  console.log("Shortest path length is ", distances[targetNode]);
  return {
    distance: distances[targetNode],
    path
  };
}

// const shortestPath = dijkstra_2(lab.graph, A.id, B.id);


// From and To are of type Node
// function djikstra(graph, from, to) {
//   const shortest_paths = {};
//   const explored = {};
//
//   // We will initialize a queue to help with tracking the order of nodes
//   // The path of nodes in order
//   let order_of_nodes = [from];
//
//   // -- Setup --
//   // nid is the id of the node
//   for (const nid of lab.nodes) {
//     shortest_paths[nid] = Infinity;
//     explored[nid] = false;
//   }
//   shortest_paths[from.id] = 0; // Because this is where you start
//
//   // -- Algorithm --
//   let i = 0;
//   let curr_node = from;
//   while (curr_node.id != to.id) {
//     let node_to_explore = null;
//     // Calculates distances between all adjacent nodes and saves shortest path
//     for (const adj_node of graph.get_node_adj(curr_node)) {
//       // node looks like [Node("A"), 2]
//       const dist = adj_node[1] + shortest_paths[curr_node.id];
//
//       shortest_paths[adj_node[0].id] = Math.min(
//         dist,
//         shortest_paths[adj_node[0].id]
//       );
//       node_to_explore = adj_node[0];
//     }
//
//     // Explore an unexplored node with the smallest estimate
//     for (const adj_node of graph.get_node_adj(curr_node)) {
//       if (explored[adj_node[0].id]) {
//         continue;
//       }
//       if (shortest_paths[adj_node[0].id] < shortest_paths[node_to_explore.id]) {
//         node_to_explore = adj_node[0];
//       }
//     }
//
//     explored[curr_node.id] = true;
//     curr_node = node_to_explore;
//     order_of_nodes.push(node_to_explore);
//   }
//
//  const shortest_distance = shortest_paths[to.id];
//  console.log(
//    "Shortest distance from ",
//    from.id,
//    " to ",
//    to.id,
//    " is ",
//    shortest_distance
//  );
//}
