import { AxiosError } from "axios";

export class CloudMailinError extends Error {
  public baseError: Error;
  public status?: number;
  public details: string;

  constructor(message: string, baseError: AxiosError) {
    // @ts-expect-error error is type any. not sure how to fix this one
    const trueMessage = baseError.response?.data?.error ?? message;
    super(trueMessage);

    this.details = trueMessage;
    this.status = baseError.response?.status;
    this.baseError = baseError;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, CloudMailinError.prototype);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
