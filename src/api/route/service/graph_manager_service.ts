import { FileManagerService } from '../../util/files/service/file_manager_service';
import Container, { Service } from 'typedi';
import { Graph } from '../../../shared/types';
import { updateGraph } from '../../../shared/command/input_converter';
import { findBestPath, buildPrettyPath } from '../../../lib';
import { RouteExistsError } from '../exception/route_exists_error';

@Service()
export class GraphManagerService {
  private mainGraph: Graph;

  constructor(private readonly fileManagerService: FileManagerService) {
    this.fileManagerService = Container.get(FileManagerService);
  }

  async loadGraph(filepath: string) {
    this.mainGraph = await this.fileManagerService.loadFile(filepath);
  }

  async addRoute(from: string, to: string, cost: number) {
    const row = [from, to, cost].join(',');

    if (this.checkRouteExists(from, to))
      throw new RouteExistsError('Route already exists');

    await this.fileManagerService.writeRoute(row);
    updateGraph(this.mainGraph, [from, to, cost.toString()]);

    return this.graph;
  }

  findBestRoute(from: string, to: string) {
    const [fromUpper, toUpper] = [from.toUpperCase(), to.toUpperCase()];

    const bestRoute = findBestPath(this.graph, fromUpper, toUpper);

    return {
      path: buildPrettyPath(bestRoute.parents, toUpper),
      cost: bestRoute.totalCost,
    };
  }

  private checkRouteExists(from: string, to: string) {
    return (
      this.graph[from] && Object.getOwnPropertyDescriptor(this.graph[from], to)
    );
  }

  get graph() {
    return this.mainGraph;
  }
}
