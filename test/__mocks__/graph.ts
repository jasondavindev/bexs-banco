import { Graph } from '../../src/shared/types';

export const graphMock: Graph = {
  A: { B: 1, C: 2 },
  B: { D: 4 },
  C: { D: 1 },
};
