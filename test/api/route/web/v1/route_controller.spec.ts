import 'reflect-metadata';
import request from 'supertest';
import { Application } from 'express';
import { GraphManagerService } from '../../../../../src/api/route/service/graph_manager_service';
import { createExpressServer } from 'routing-controllers';
import { GlobalErrorHandler } from '../../../../../src/api/util/http/global_error_handler';
import { RouteController } from '../../../../../src/api/route/controller/v1/route_controller';
import { graphMock } from '../../../../__mocks__/graph';
import { RouteExistsError } from '../../../../../src/api/route/exception/route_exists_error';

describe('RouteController', () => {
  let app: Application;

  beforeAll(() => {
    app = createExpressServer({
      routePrefix: '/api',
      defaultErrorHandler: false,
      controllers: [RouteController],
      middlewares: [GlobalErrorHandler],
    });
  });

  describe('POST /', () => {
    const uri = '/api/v1/routes';

    describe('when the route exist', () => {
      it('should return CONFLICT', async () => {
        jest
          .spyOn(GraphManagerService.prototype, 'checkRouteExists')
          .mockImplementationOnce(() => {
            throw new RouteExistsError('Route already exists');
          });

        const result = await request(app).post(uri).expect(409);
        expect(result.body.error).toBe('CONFLICT');
        expect(result.body.message).toBe('Route already exists');
      });
    });

    describe('when the route not exist', () => {
      it('should return the graph', async () => {
        jest
          .spyOn(GraphManagerService.prototype, 'addRoute')
          .mockResolvedValueOnce(graphMock);
        jest
          .spyOn(GraphManagerService.prototype, 'graph', 'get')
          .mockReturnValueOnce(graphMock);

        const result = await request(app).post(uri).expect(201);
        expect(result.body).toEqual(graphMock);
      });
    });
  });
});
