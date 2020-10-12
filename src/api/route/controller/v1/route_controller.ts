import { Response } from 'express';
import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Res,
} from 'routing-controllers';
import Container from 'typedi';
import { GraphManagerService } from '../../service/graph_manager_service';
import { AddRouteRequest } from './request/add_route_request';

@JsonController('/v1/routes')
export class RouteController {
  constructor(private readonly graphManagerService: GraphManagerService) {
    this.graphManagerService = Container.get(GraphManagerService);
  }

  @Post('/')
  async addRoute(@Body() body: AddRouteRequest, @Res() response: Response) {
    const { from, to, cost } = body;

    await this.graphManagerService.addRoute(from, to, cost);
    return response.status(201).json(this.graphManagerService.graph);
  }

  @Get('/:from/to/:to')
  getRoutes(@Param('from') fromRoute: string, @Param('to') toRoute: string) {
    return this.graphManagerService.findBestRoute(fromRoute, toRoute);
  }
}
