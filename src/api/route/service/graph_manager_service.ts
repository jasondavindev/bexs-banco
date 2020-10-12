import { FileManager } from '../../util/files/file_manager';
import { Service } from 'typedi';
import { Graph } from '../../../shared/types';
import { findBestPath, buildPrettyPath } from '../../../lib';
import { RouteExistsError } from '../exception/route_exists_error';
import { updateGraph } from '../../../shared/command/graphs';

type LoadFunction = (routesFilePath: string) => Promise<Graph>;

@Service()
export class GraphManagerService {
  private mainGraph: Graph;
  private routesFilePath: string;

  async loadGraph(routesFilePath: string, loadFunction: LoadFunction) {
    this.routesFilePath = routesFilePath;
    this.setGraph(await loadFunction(routesFilePath));
    return this.mainGraph;
  }

  async addRoute(from: string, to: string, cost: number) {
    const row = [from, to, cost].join(',');

    if (this.checkRouteExists(from, to))
      throw new RouteExistsError('Route already exists');

    await FileManager.writeRoute(this.routesFilePath, row);
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

  setGraph(graph: Graph) {
    this.mainGraph = graph;
    return this.mainGraph;
  }

  public checkRouteExists(from: string, to: string) {
    return (
      this.graph[from] && Object.getOwnPropertyDescriptor(this.graph[from], to)
    );
  }

  get graph() {
    return this.mainGraph;
  }
}
