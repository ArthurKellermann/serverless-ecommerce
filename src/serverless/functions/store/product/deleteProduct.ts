import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';

const requestParams = z.object({
    productId: z.string().uuid()
});

type deleteProductSchema = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await deleteProductFunction(event.pathParameters as deleteProductSchema);

    return {
        statusCode: result.statusCode,
        body: result.body
    };

}

const deleteProductFunction = async (eventPathParameters: deleteProductSchema) => {
    const { productId } = eventPathParameters;

    const product = await prismaClient.product.delete({
        where: {
            id: productId
        },
    })

    return {
        statusCode: 200,
        body: JSON.stringify(product),
    };

}


