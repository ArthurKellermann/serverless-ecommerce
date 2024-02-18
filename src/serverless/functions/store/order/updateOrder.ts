import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';
import { z } from "zod";
import { mergeBody } from '../../../../common/utils/mergeBody';
import { errorHandlingHelper } from '../../../../common/utils/errorHandlingHelper'

const requestBody = z.object({
    quantity: z.number().optional(),
    status: z.string().optional(),
    userId: z.string().uuid().optional(),
    productId: z.string().uuid().optional()
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await updateOrderFunction(event);

    return {
        statusCode: result.statusCode,
        body: result.body
    };
}

const updateOrderFunction = async (event: APIGatewayProxyEvent) => {
    try {
        const { orderId, ...data } = mergeBody(event);

        const updateOrderData = requestBody.parse(data);

        const order = await prismaClient.order.update({
            data,
            where: {
                id: orderId
            }
        });

        if (updateOrderData.status === 'Delivered') {
            const product = await prismaClient.product.findUnique({
                where: {
                    id: order.productId
                }
            });
            
            if (product.stockQuantity >= order.quantity) {
                await prismaClient.product.update({
                    where: {
                        id: order.productId
                    },
                    data: {
                        stockQuantity: product.stockQuantity - order.quantity
                    }
                });
            } else {
                throw new Error('Insufficient stock quantity');
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(order)
        };

    } catch (error) {
        return errorHandlingHelper(error);
    }
}
