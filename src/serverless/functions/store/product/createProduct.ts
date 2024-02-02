import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';
import { z } from "zod";
import { errorHandlingHelper } from "src/common/utils/errorHandlingHelper";

const requestBody = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    stockQuantity: z.number()
});

type Product = z.infer<typeof requestBody>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await createProductFunction(event.body);

    return {
        statusCode: result.statusCode,
        body: result.body,
    };
}

const createProductFunction = async (eventBody: string): Promise<APIGatewayProxyResult> => {
    try {
        const { description, name, price, stockQuantity } = JSON.parse(eventBody!) as Product;

        requestBody.parse({ description, name, price, stockQuantity });

        const product = await prismaClient.product.create({
            data: {
                description, name, price, stockQuantity
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(product),
        };
    } catch (error) {
        return errorHandlingHelper(error);

    }
}
