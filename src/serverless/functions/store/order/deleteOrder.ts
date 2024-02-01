import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';

const requestParams = z.object({
    orderId: z.string().uuid()
});

type deleteOrderSchema = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await deleteOrderLogic(event.pathParameters as deleteOrderSchema);

    return {
        statusCode: result.statusCode,
        body: result.body
    };

}

const deleteOrderLogic = async (eventPathParameters: deleteOrderSchema) => {
    const { orderId } = eventPathParameters;

    const order = await prismaClient.order.delete({
        where: {
            id: orderId
        },
    })

    return {
        statusCode: 200,
        body: JSON.stringify(order),
    };

}


