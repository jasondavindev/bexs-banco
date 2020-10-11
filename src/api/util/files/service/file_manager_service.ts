import { Service } from 'typedi';
import fs from 'fs';
import { promisify } from 'util';
import { parseFileToGraph } from '../../../../shared/command/input_converter';
const fsAsync = promisify(fs.appendFile);

@Service()
export class FileManagerService {
  private filePath: string;

  async loadFile(filepath: string) {
    this.filePath = filepath;
    return parseFileToGraph(filepath);
  }

  async writeRoute(row: string) {
    return fsAsync(this.filePath, row, { encoding: 'utf-8' });
  }
}
