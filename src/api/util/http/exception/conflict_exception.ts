import { CONFLICT } from 'http-status';

export class ConflictException extends Error {
  public status: number;

  constructor(message?: string) {
    super(message);
    this.name = 'CONFLICT';
    this.message = message;
    this.status = CONFLICT;
  }
}
