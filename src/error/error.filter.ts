import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GatewayErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log(exception);
    // Tentukan status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Ambil respons dari exception
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    // Siapkan response body
    const responseBody = {
      success: false,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse // Jika string, gunakan langsung sebagai message
          : typeof exceptionResponse === 'object' &&
              'message' in exceptionResponse
            ? (exceptionResponse as any).message
            : 'An unexpected error occurred', // Jika object memiliki message, gunakan
      errors:
        typeof exceptionResponse === 'object' && 'errors' in exceptionResponse
          ? (exceptionResponse as any).errors
          : [],
      statusCode: status,
    };

    // Tambahkan log error untuk debugging
    console.error(
      `Error in API Gateway [${request.method} ${request.url}]:`,
      responseBody,
    );

    // Kirim response JSON
    response.status(status).json(responseBody);
  }
}
