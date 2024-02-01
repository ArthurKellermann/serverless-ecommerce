import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';
import { z } from "zod";

const requestBody = z.object({
    quantity: z.number(),
    status: z.string(),
    userId: z.string().uuid(),
    productId: z.string().uuid()
});

type Order = z.infer<typeof requestBody>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await createOrderLogic(event.body);

    return {
        statusCode: result.statusCode,
        body: result.body,
    };
}

const createOrderLogic = async (eventBody: string): Promise<APIGatewayProxyResult> => {
    try {
        const { quantity, status, userId, productId } = JSON.parse(eventBody!) as Order;

        requestBody.parse({ quantity, status, userId, productId });

        const order = await prismaClient.order.create({
            data: {
                quantity, status, userId, productId
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(order),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request.' }),
        };

    }
}
