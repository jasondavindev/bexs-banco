import 'reflect-metadata';
import request from 'supertest';
import { Application } from 'express';
import { GraphManagerService } from '../../../../../src/api/route/service/graph_manager_service';
import { createExpressServer } from 'routing-controllers';
import { GlobalErrorHandler } from '../../../../../src/api/util/http/global_error_handler';
import { RouteController } from '../../../../../src/api/route/controller/v1/route_controller';
import { graphMock } from '../../../../__mocks__/graph';
import { RouteExistsError } from '../../../../../src/api/route/exception/route_exists_error';
import { MissingNodeError } from '../../../../../src/lib/exception/missing_node_error';

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

  describe('GET /:from/to/:to', () => {
    const uri = '/api/v1/routes/GRU/to/CDG';

    describe('when is not missing route', () => {
      it('should return the best route', async () => {
        const bestRoute = {
          path: ['A', 'B', 'C'],
          cost: 50,
        };

        jest
          .spyOn(GraphManagerService.prototype, 'findBestRoute')
          .mockImplementationOnce(() => bestRoute);

        const result = await request(app).get(uri).expect(200);

        expect(result.body).toEqual(bestRoute);
      });
    });

    describe('when the start not not exists', () => {
      it('should return an error', async () => {
        jest
          .spyOn(GraphManagerService.prototype, 'findBestRoute')
          .mockImplementationOnce(() => {
            throw new MissingNodeError('Missing start node');
          });

        const result = await request(app).get(uri).expect(500);
        expect(result.body.error).toBe('INTERNAL_SERVER_ERROR');
        expect(result.body.message).toBe('Missing start node');
      });
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
