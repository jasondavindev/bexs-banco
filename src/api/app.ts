import dotenv from 'dotenv';
import path from 'path';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import Container from 'typedi';
import { getInputFile } from '../shared/command/cli';
import { GraphManagerService } from './route/service/graph_manager_service';
import { FileManager } from './util/files/file_manager';
import { GlobalErrorHandler } from './util/http/global_error_handler';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const filepath = getInputFile();
Container.get(GraphManagerService).loadGraph(filepath, FileManager.loadFile);

export const app = createExpressServer({
  cors: true,
  routePrefix: '/api',
  defaultErrorHandler: false,
  controllers: [`${path.resolve(__dirname, '**', '*_controller.ts')}`],
  middlewares: [GlobalErrorHandler],
});
