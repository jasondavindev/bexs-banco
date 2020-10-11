import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { Graph } from 'src/shared/types';
import { updateGraph } from './graphs';

export const parseFileToGraph = (filePath: string): Promise<Graph> => {
  const graph: Graph = {};

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(filePath))
      .pipe(csvParse())
      .on('data', (row) => updateGraph(graph, row))
      .on('end', () => resolve(graph))
      .on('error', (e) => reject(e));
  });
};
