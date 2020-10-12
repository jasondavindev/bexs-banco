import { getInputFile } from '../../src/shared/command/cli';
import { ApplicationBootstrap } from './app';

const PORT = Number(process.env.NODE_PORT);
const routesFilePath = getInputFile();
const applicationBootstrap = new ApplicationBootstrap();
applicationBootstrap.createApp(routesFilePath);

applicationBootstrap.app.listen(PORT, () => {
  applicationBootstrap.log.info('Server listening on port ' + PORT);
});
