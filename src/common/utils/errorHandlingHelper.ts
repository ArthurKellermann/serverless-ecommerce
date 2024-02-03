import { ZodError } from "zod";

export const errorHandlingHelper = (error) => {
    const badRequestStatusCode = 400;

    if (error instanceof ZodError) {
        return {
            statusCode: badRequestStatusCode,
            body: JSON.stringify({
                message: 'Invalid Request', error: error.issues.map(issue => {
                    return {
                        path: issue.path,
                        message: issue.message
                    }
                })}),
        };
    } else {
        return {
            statusCode: badRequestStatusCode,
            body: JSON.stringify({ message: 'Invalid Request' }),
        };
    }
}