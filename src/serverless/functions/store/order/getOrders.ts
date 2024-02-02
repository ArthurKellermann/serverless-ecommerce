import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await getOrdersFunction();

    return {
        statusCode: result.statusCode,
        body: result.body
    };
}

const getOrdersFunction = async () => {
    const orders = await prismaClient.order.findMany();

    return {
        statusCode: 200,
        body: JSON.stringify(orders)
    };
}