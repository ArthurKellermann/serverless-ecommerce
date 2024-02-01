import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';

const requestParams = z.object({
    userId: z.string().uuid()
});

type getUserByIdSchema = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await getOrdersByUserLogic(event.pathParameters);

    return {
        statusCode: result.statusCode,
        body: result.body
    }
}

const getOrdersByUserLogic = async (eventPathParameters: getUserByIdSchema) => {
    try {
        const { userId } = eventPathParameters;

        const orders = await prismaClient.order.findMany({
            where: {
                userId
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(orders)
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request.' }),
        };
    }

} 
