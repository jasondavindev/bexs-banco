import { RouteExistsError } from '../../../src/api/route/exception/route_exists_error';
import { GraphManagerService } from '../../../src/api/route/service/graph_manager_service';
import { FileManager } from '../../../src/api/util/files/file_manager';
import * as graphFuncs from '../../../src/lib';
import { Graph } from '../../../src/shared/types';
import { graphMock } from '../../__mocks__/graph';

jest.mock('../../../src/api/util/files/file_manager');
jest.mock('../../../src/lib');

describe('GraphManagerService', () => {
  let graphManagerService: GraphManagerService;

  beforeEach(() => {
    graphManagerService = new GraphManagerService();
  });

  describe('#loadGraph', () => {
    it('loads routes file and updates graph setup', async () => {
      const graph: Graph = graphMock;
      const loadFunc = jest.fn().mockResolvedValueOnce(graph);
      const routesFilePath = 'abc.csv';

      await graphManagerService.loadGraph(routesFilePath, loadFunc);
      expect(graphManagerService.graph).toEqual(graph);
    });
  });

  describe('#addRoute', () => {
    beforeEach(() => {
      FileManager.writeRoute = jest.fn().mockResolvedValueOnce(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when the route doest not yet exist', () => {
      it('should update the graph', async () => {
        const graph: Graph = graphMock;
        graphManagerService.setGraph(graph);
        await graphManagerService.addRoute('A', 'E', 50);

        expect(graphManagerService.graph['A']).toHaveProperty('E');
        expect(graphManagerService.graph['A']['E']).toBe(50);
      });
    });

    describe('when the route already exist', () => {
      it('should throw an error', async () => {
        const graph: Graph = graphMock;
        graph['A']['E'] = 1;
        graphManagerService.setGraph(graph);

        expect(graphManagerService.addRoute('A', 'E', 50)).rejects.toThrow(
          RouteExistsError
        );
      });
    });
  });

  describe('#findBestRoute', () => {
    it('should return the best route and its cost', () => {
      Object.defineProperties(graphFuncs, {
        findBestPath: {
          value: jest.fn().mockImplementationOnce(() => ({
            totalCost: 10,
          })),
        },
        buildPrettyPath: {
          value: jest.fn().mockImplementationOnce(() => ['A', 'B', 'C']),
        },
      });

      expect(graphManagerService.findBestRoute('A', 'C')).toEqual({
        cost: 10,
        path: ['A', 'B', 'C'],
      });
    });
  });
});
