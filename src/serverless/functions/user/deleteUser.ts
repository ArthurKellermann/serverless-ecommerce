import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { UserMapper } from "../../../mappers/userMapper";

const requestParams = z.object({
    userId: z.string().uuid({ message: 'Enter a valid UUID' })
});

type deleteUserSchema = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { userId } = event.pathParameters as deleteUserSchema;

    const user = await prismaClient.user.delete({
        where: {
            id: userId
        },
    })

    return {
        statusCode: 200,
        body: JSON.stringify(UserMapper.toHttp(user))
    }

}
