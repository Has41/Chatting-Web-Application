export class HttpException extends Error {
  statusCode: number
  message: string

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (status: number, message: string): HttpException => {
  return new HttpException(status, message)
}
