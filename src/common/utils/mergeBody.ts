import { APIGatewayProxyEvent } from 'aws-lambda';

export function mergeBody(event: APIGatewayProxyEvent) {
    const { body = {}, pathParameters = {}, queryStringParameters = {} } = event;

    return {
        ...pathParameters,
        ...queryStringParameters,
        ...(typeof body === 'string' ? JSON.parse(body) : body),
    };
}
