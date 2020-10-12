import dotenv from 'dotenv';
import path from 'path';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { ClassLogger, Logger, LogService } from '../../src/common/logger';
import Container from 'typedi';
import { getInputFile } from '../shared/command/cli';
import { GraphManagerService } from './route/service/graph_manager_service';
import { FileManager } from './util/files/file_manager';
import { GlobalErrorHandler } from './util/http/global_error_handler';
import { Application } from 'express';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

@Logger()
export class ApplicationBootstrap implements ClassLogger {
  public log: LogService;
  public app: Application;

  createApp(routesFilePath: string) {
    Container.get(GraphManagerService).loadGraph(
      routesFilePath,
      FileManager.loadFile
    );

    return (this.app = createExpressServer({
      cors: true,
      routePrefix: '/api',
      defaultErrorHandler: false,
      controllers: [`${path.resolve(__dirname, '**', '*_controller.ts')}`],
      middlewares: [GlobalErrorHandler],
    }));
  }
}

// const routesFilePath = getInputFile();

// export const app = new ApplicationBootstrap().start(routesFilePath);
