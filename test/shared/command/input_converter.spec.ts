import { Graph } from '../../../src/shared/types';
import { updateGraph } from '../../../src/shared/command/input_converter';

describe('#updateGraph', () => {
  it('should update graph nodes', () => {
    const graph: Graph = {};
    const firstRow = ['ABC', 'DEF', '40'];
    const secondRow = ['ABC', 'HIJ', '10'];

    updateGraph(graph, firstRow);

    expect(graph).toHaveProperty('ABC');
    expect(graph['ABC']).toHaveProperty('DEF');
    expect(graph['ABC']['DEF']).toEqual(40);

    updateGraph(graph, secondRow);
    expect(graph['ABC']['HIJ']).toEqual(10);
  });
});
