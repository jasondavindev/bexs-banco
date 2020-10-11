import { MissingNodeError } from "./exception/missing_node_error";
import { RouteNotFoundError } from "./exception/route_not_found_error";
import { Node, Parents, Graph } from "../shared/types";

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
  checkNodes(graph, startNode);

  const costs: Node = Object.assign(
    { [targetNode]: Infinity },
    graph[startNode]
  );

  const parents: Parents = { [targetNode]: null };

  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }

  const processed = [];

  let node = getLowerCost(costs, processed);

  while (node) {
    const children = graph[node];
    updateChildrenCosts(children, costs, parents, node);
    processed.push(node);
    node = getLowerCost(costs, processed);
  }

  if (costs[targetNode] == Infinity) throw new RouteNotFoundError("Route not found");

  return {
    totalCost: costs[targetNode],
    parents,
  };
};

export const updateChildrenCosts = (
  children: Node,
  costs: Node,
  parents: Parents,
  node: string
) => {
  if (!children) return;

  const cost = costs[node];

  Object.keys(children).forEach((child) => {
    const newCost = cost + children[child];

    if (!costs[child] || newCost < costs[child]) {
      costs[child] = newCost;
      parents[child] = node;
    }
  });
};

export const buildPrettyPath = (
  parents: Parents,
  targetNode: string
): string[] => {
  let fullPath = [targetNode];
  let parent = parents[targetNode];

  while (parent) {
    fullPath.push(parent);
    parent = parents[parent];
  }

  return fullPath.reverse();
};

export const checkNodes = (graph: Graph, startNode: string) => {
  if (!Object.getOwnPropertyDescriptor(graph, startNode))
    throw new MissingNodeError("Missing start node");
};
