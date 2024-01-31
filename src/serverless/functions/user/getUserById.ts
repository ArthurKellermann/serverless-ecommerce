import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { AppError } from "../../../common/errors/appError";
import { UserMapper } from "../../../mappers/userMapper";

const requestParams = z.object({
    userId: z.string().uuid()
});

type getUserByIdSchema = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await getUserByIdLogic(event.pathParameters);

    return {
        statusCode: result.statusCode,
        body: result.body
    }
}

const getUserByIdLogic = async (eventPathParameters: getUserByIdSchema) => {
    try {
        const { userId } = eventPathParameters;

        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
        })

        if (!user) {
            throw new AppError('User does not exists', 400);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(UserMapper.toHttp(user))
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request.' }),
        };
    }

} 
