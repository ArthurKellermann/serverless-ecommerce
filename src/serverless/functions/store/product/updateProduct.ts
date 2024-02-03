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
    let result = await updateProductFunction(event);

    return {
        statusCode: result.statusCode,
        body: result.body
    };
}

const updateProductFunction = async (event: APIGatewayProxyEvent) => {
    try {
        const { productId, ...data } = mergeBody(event);

        requestBody.parse(data);

        const product = await prismaClient.product.update({
            data: {
                name: data.name,
                price: data.price,
                description: data.description,
                stockQuantity: data.stockQuantity
            },
            where: {
                id: productId
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(product)
        };

    } catch (error) {
        return errorHandlingHelper(error);

    }
}
