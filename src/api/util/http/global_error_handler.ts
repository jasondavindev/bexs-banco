import { Request, Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';
import { RouteExistsError } from '../../route/exception/route_exists_error';
import { ConflictException } from './exception/conflict_exception';
import { InternalServerError } from './exception/internal_server_error';

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(error, _req: Request, res: Response) {
    const exception = this.getHttpException(error);
    return res
      .status(exception.status)
      .json({ error: exception.name, message: exception.message });
  }

  private getHttpException(error: Error) {
    if (error instanceof RouteExistsError) {
      return new ConflictException(error.message);
    }

    return new InternalServerError(error.message);
  }
}
