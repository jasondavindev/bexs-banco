import { INTERNAL_SERVER_ERROR } from 'http-status';

export class InternalServerError extends Error {
  public status: number;

  constructor(message?: string) {
    super(message);
    this.name = 'INTERNAL_SERVER_ERROR';
    this.message = message;
    this.status = INTERNAL_SERVER_ERROR;
  }
}
