import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';
import { z } from "zod";
import { mergeBody } from '../../../../common/utils/mergeBody';

const requestBody = z.object({
    quantity: z.number(),
    status: z.string(),
    userId: z.string().uuid(),
    productId: z.string().uuid()
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await updateOrderLogic(event);

    return {
        statusCode: result.statusCode,
        body: result.body
    };
}

const updateOrderLogic = async (event: APIGatewayProxyEvent) => {
    try {
        const { orderId, ...data } = mergeBody(event);

        requestBody.parse(data);

        const order = await prismaClient.order.update({
            data,
            where: {
                id: orderId
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(order)
        };

    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request.' }),
        };

    }
}
