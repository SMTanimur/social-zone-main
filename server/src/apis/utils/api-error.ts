export class ApiError extends Error {
  status: number;
  error?: string | any;
  constructor(status: number, message: string, error?: string | any) {
    super(message);
    this.status = status;
    this.error = error;
  }
}
