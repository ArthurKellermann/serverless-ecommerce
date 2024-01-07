import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { UserMapper } from "../../../mappers/userMapper";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const users = await prismaClient.user.findMany();

    return {
        statusCode: 200,
        body: JSON.stringify(UserMapper.toHttpList(users))
    };
}