import prompt from 'prompt';
import { promisify } from 'util';
import { buildPrettyPath, findBestPath } from '../lib';
import { parseFileToGraph } from '../shared/command/input_converter';
import { getInputFile } from '../shared/command/command_input';

const promptGetAsync = promisify(prompt.get);

(async () => {
  try {
    const filepath = getInputFile();

    const graph = await parseFileToGraph(filepath);

    prompt.start();
    const route = (await promptGetAsync(['route'])).route;
    const [start, target] = route.split('-');

    const bestPath = findBestPath(graph, start, target);
    const prettyPath = buildPrettyPath(bestPath.parents, target);

    console.log(
      'best route',
      prettyPath.join(' - '),
      '>',
      `$${bestPath.totalCost}`
    );
  } catch (error) {
    console.log(error.message);
  }
})();
