import { MissingNodeError } from "./exception/missing_node_error";

type Node = { [key: string]: number };
type Graph = { [key: string]: Node };
type Parents = { [key: string]: string };

export const getLowerCost = (costs: Node, processed: string[]) => {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

export const findBestPath = (
  graph: Graph,
  startNode: string,
  targetNode: string
) => {
  const costs = Object.assign({ [targetNode]: Infinity }, graph[startNode]);

  const parents: Parents = { [targetNode]: null };

  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }

  const processed = [];

  let node = getLowerCost(costs, processed);

  while (node) {
    let cost = costs[node];
    let children = graph[node];

    for (let n in children) {
      let newCost = cost + children[n];
      if (!costs[n] || costs[n] > newCost) {
        costs[n] = newCost;
        parents[n] = node;
      }
    }

    processed.push(node);
    node = getLowerCost(costs, processed);
  }

  return {
    totalCost: costs[targetNode],
    parents,
  };
};

export const buildPrettyPath = (
  parents: Parents,
  totalCost: number,
  targetNode: string
) => {
  let optimalPath = [targetNode];
  let parent = parents[targetNode];

  while (parent) {
    optimalPath.push(parent);
    parent = parents[parent];
  }

  optimalPath.reverse();

  const results = {
    distance: totalCost,
    path: optimalPath,
  };

  return results;
};

export const checkNodes = (
  graph: Graph,
  startNode: string,
  targetNode: string
) => {
  if (!Object.getOwnPropertyDescriptor(graph, startNode))
    throw new MissingNodeError("Missing start node");

  if (!Object.getOwnPropertyDescriptor(graph, targetNode))
    throw new MissingNodeError("Missing target node");
};
