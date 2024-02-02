import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';
import { errorHandlingHelper } from "src/common/utils/errorHandlingHelper";

const requestParams = z.object({
    userId: z.string().uuid()
});

type getUserByIdSchema = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await getOrdersByUserFunction(event.pathParameters);

    return {
        statusCode: result.statusCode,
        body: result.body
    }
}

const getOrdersByUserFunction = async (eventPathParameters: getUserByIdSchema) => {
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
        return errorHandlingHelper(error);
    }

} 
