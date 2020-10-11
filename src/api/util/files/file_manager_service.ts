import fs from 'fs';
import { promisify } from 'util';
import { parseFileToGraph } from '../../../shared/command/input_converter';
const fsAsync = promisify(fs.appendFile);

export class FileManager {
  static async loadFile(filepath: string) {
    return parseFileToGraph(filepath);
  }

  static async writeRoute(filepath: string, row: string) {
    return fsAsync(filepath, row, { encoding: 'utf-8' });
  }
}
