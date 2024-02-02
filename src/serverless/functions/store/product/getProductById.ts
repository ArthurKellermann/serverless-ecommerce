import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { prismaClient } from '../../../../common/database/prisma/prismaClient'
import { AppError } from '../../../../common/errors/appError';
import { errorHandlingHelper } from "src/common/utils/errorHandlingHelper";

const requestParams = z.object({
    productId: z.string().uuid()
});

type getProductByIdSchema = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await getProductByIdFunction(event.pathParameters);

    return {
        statusCode: result.statusCode,
        body: result.body
    }
}

const getProductByIdFunction = async (eventPathParameters: getProductByIdSchema) => {
    try {
        const { productId } = eventPathParameters;

        const product = await prismaClient.product.findUnique({
            where: {
                id: productId
            },
        })

        if (!product) {
            throw new AppError('Product does not exists', 400);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(product)
        }
    } catch (error) {
        return errorHandlingHelper(error);
    }

} 
