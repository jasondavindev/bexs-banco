import Container from 'typedi';
import { LogService } from './service';

export interface ClassLogger {
  readonly log: LogService;
}

export function Logger() {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor implements ClassLogger {
      log = Container.get(LogService);
    };
  };
}
