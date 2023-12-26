import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../database/prisma/prismaClient";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const users = await prismaClient.user.findMany();

    return {
        statusCode: 200,
        body: JSON.stringify(users)
    };
}