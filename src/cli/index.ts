import prompt from "prompt";
import { promisify } from "util";
import { buildPrettyPath, checkNodes, findBestPath } from "../lib";
import { MissingInputFileError } from "./exception/missing_input_file_error";
import { parseFileToGraph } from "./command/input_converter";

const promptGetAsync = promisify(prompt.get);

(async () => {
  try {
    const [filepath] = process.argv.splice(2, 1);
    if (!filepath) throw new MissingInputFileError("Missing input file");

    const graph = await parseFileToGraph(filepath);

    prompt.start();
    const route = (await promptGetAsync(["route"])).route;
    const [start, target] = route.split("-");

    const bestPath = findBestPath(graph, start, target);
    const prettyPath = buildPrettyPath(bestPath.parents, target);

    console.log(
      "best route",
      prettyPath.join(" - "),
      ">",
      `$${bestPath.totalCost}`
    );
  } catch (error) {
    console.log(error.message);
  }
})();
