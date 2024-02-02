import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';
import { z } from "zod";
import { errorHandlingHelper } from "src/common/utils/errorHandlingHelper"

const requestBody = z.object({
    quantity: z.number(),
    status: z.string().optional(), // "Pending" set as default value
    userId: z.string(),
    productId: z.string()
});

type Order = z.infer<typeof requestBody>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await createOrderFunction(event.body);

    return {
        statusCode: result.statusCode,
        body: result.body,
    };
}

const createOrderFunction = async (eventBody: string): Promise<APIGatewayProxyResult> => {
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
        return errorHandlingHelper(error);

    }
}
