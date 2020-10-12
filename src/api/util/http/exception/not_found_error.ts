export class NotFoundError extends Error {
  public status: number;

  constructor(message?: string) {
    super(message);
    this.message = message;
    this.name = 'NOT_FOUND';
    this.status = 404;
  }
}
