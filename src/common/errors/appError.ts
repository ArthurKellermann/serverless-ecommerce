export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
    }
}

