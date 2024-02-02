import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await getProductsFunction();

    return {
        statusCode: result.statusCode,
        body: result.body
    };
}

const getProductsFunction = async () => {
    const products = await prismaClient.product.findMany();

    return {
        statusCode: 200,
        body: JSON.stringify(products)
    };
}