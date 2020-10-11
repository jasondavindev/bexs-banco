import * as lib from '../../src/lib';
import { MissingNodeError } from '../../src/lib/exception/missing_node_error';
import { RouteNotFoundError } from '../../src/lib/exception/route_not_found_error';
import { Graph, Node, Parents } from '../../src/shared/types';

describe('#getLowerCost', () => {
  it('should return the cheapest node', () => {
    const node: Node = { A: 1, B: 2 };

    expect(lib.getLowerCost(node, [])).toEqual('A');
  });
});

describe('#updateChildrenCosts', () => {
  it('should update the children costs and parents', () => {
    const children: Node = { B: 2, C: 4 };
    const costs: Node = { A: 1 };
    const parents: Parents = {};

    lib.updateChildrenCosts(children, costs, parents, 'A');

    expect(costs.B).toEqual(3);
    expect(costs.C).toEqual(5);
    expect(parents.B).toEqual('A');
    expect(parents.C).toEqual('A');
  });
});

describe('#buildPrettyPath', () => {
  it('should return a string containing each node of the best route', () => {
    const parents: Parents = { B: 'A', D: 'B', E: 'D' };
    expect(lib.buildPrettyPath(parents, 'E')).toEqual(['A', 'B', 'D', 'E']);
  });
});

describe('#checkNodes', () => {
  describe('when the node exists', () => {
    it('do nothing', () => {
      const graph: Graph = { A: {} };
      expect(() => lib.checkNodes(graph, 'A')).not.toThrow();
    });
  });

  describe('when the node not exists', () => {
    it('throws an missing node error', () => {
      const graph: Graph = {};
      expect(() => lib.checkNodes(graph, 'A')).toThrow(MissingNodeError);
    });
  });
});

describe('#findBestPath', () => {
  describe('when there is a possible route', () => {
    it('should return the best route and total cost', () => {
      const graph: Graph = {
        A: { B: 1, C: 3 },
        B: { D: 4 },
        C: { D: 1 },
      };

      const result = lib.findBestPath(graph, 'A', 'D');
      expect(result.totalCost).toEqual(4);
      expect(result.parents).toEqual({
        C: 'A',
        B: 'A',
        D: 'C',
      });
    });
  });

  describe('when there are not a possible route', () => {
    it('should throw a route not found error', () => {
      const graph: Graph = {
        A: { B: 1, C: 3 },
        B: { C: 1 },
      };

      expect(() => lib.findBestPath(graph, 'A', 'D')).toThrow(
        RouteNotFoundError
      );
    });
  });
});
