import { Response } from 'express';
import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Res,
} from 'routing-controllers';
import { Logger, ClassLogger, LogService } from '../../../../common/logger';
import Container from 'typedi';
import { GraphManagerService } from '../../service/graph_manager_service';
import { AddRouteRequest } from './request/add_route_request';

@JsonController('/v1/routes')
@Logger()
export class RouteController implements ClassLogger {
  constructor(
    private readonly graphManagerService: GraphManagerService,
    public log: LogService
  ) {
    this.graphManagerService = Container.get(GraphManagerService);
  }

  @Post('/')
  async addRoute(@Body() body: AddRouteRequest, @Res() response: Response) {
    this.log.info('RouteController - Starting add route');
    const { from, to, cost } = body;
    await this.graphManagerService.addRoute(from, to, cost);
    this.log.info('RouteController - Route has been added');
    return response.status(201).json(this.graphManagerService.graph);
  }

  @Get('/:from/to/:to')
  getRoutes(@Param('from') fromRoute: string, @Param('to') toRoute: string) {
    return this.graphManagerService.findBestRoute(fromRoute, toRoute);
  }
}
