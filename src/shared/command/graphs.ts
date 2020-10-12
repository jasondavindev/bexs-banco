import { Graph } from '../types';

export const updateGraph = (graph: Graph, row: string[]) => {
  const [parent, child, cost] = row;

  if (!Object.getOwnPropertyDescriptor(graph, parent)) {
    graph[parent] = {};
  }

  graph[parent][child] = Number(cost);
};
