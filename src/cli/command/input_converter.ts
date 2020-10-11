import csvParse from "csv-parse";
import fs from "fs";
import path from "path";
import { Graph } from "src/shared/types";

export const parseFileToGraph = (filePath: string): Promise<Graph> => {
  const graph: Graph = {};

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(filePath))
      .pipe(csvParse())
      .on("data", (row) => updateGraph(graph, row))
      .on("end", () => resolve(graph))
      .on("error", (e) => reject(e));
  });
};

const updateGraph = (graph: Graph, row: string[]) => {
  const [parent, child, cost] = row;

  if (!Object.getOwnPropertyDescriptor(graph, parent)) {
    graph[parent] = {};
  }

  graph[parent][child] = Number(cost);
};
