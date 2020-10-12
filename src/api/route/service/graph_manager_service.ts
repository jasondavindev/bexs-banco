import { FileManager } from '../../util/files/file_manager';
import { Service } from 'typedi';
import { Graph } from '../../../shared/types';
import { findBestPath, buildPrettyPath } from '../../../lib';
import { RouteExistsError } from '../exception/route_exists_error';
import { updateGraph } from '../../../shared/command/graphs';
import { Logger, LogService, ClassLogger } from '../../../common/logger';

type LoadFunction = (routesFilePath: string) => Promise<Graph>;

@Service()
@Logger()
export class GraphManagerService implements ClassLogger {
  private mainGraph: Graph;
  private routesFilePath: string;
  public log: LogService;

  async loadGraph(routesFilePath: string, loadFunction: LoadFunction) {
    this.routesFilePath = routesFilePath;
    this.log.info('GraphManagerService - Loading graph file');
    this.setGraph(await loadFunction(routesFilePath));
    this.log.info('GraphManagerService - Graph file read');
    return this.mainGraph;
  }

  async addRoute(from: string, to: string, cost: number) {
    const row = [from, to, cost].join(',');

    if (this.checkRouteExists(from, to)) {
      this.log.error(
        'GraphManagerService - Trying add existing route to graph',
        { from, to, cost }
      );
      throw new RouteExistsError('Route already exists');
    }

    this.log.info('GraphManagerService - Writing in file');
    await FileManager.writeRoute(this.routesFilePath, row);
    this.log.info('GraphManagerService - Finish writing file');

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
