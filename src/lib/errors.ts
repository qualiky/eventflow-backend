export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFound = (resource: string) =>
  new AppError(404, `${resource} not found`);

export const forbidden = (msg = "Forbidden") => new AppError(403, msg);

export const conflict = (msg: string) => new AppError(409, msg);

export const unauthorized = (msg = "Unauthorised") => new AppError(401, msg);
