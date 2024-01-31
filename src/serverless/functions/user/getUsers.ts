import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { UserMapper } from "../../../mappers/userMapper";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await getUsersLogic();

    return {
        statusCode: result.statusCode,
        body: result.body
    };
}

const getUsersLogic = async () => {
    const user = await prismaClient.user.findMany();

    return {
        statusCode: 200,
        body: JSON.stringify(UserMapper.toHttpList(user))
    };
}