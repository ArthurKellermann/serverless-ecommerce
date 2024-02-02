import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { UserMapper } from "../../../mappers/userMapper";

const requestParams = z.object({
    userId: z.string().uuid()
});

type deleteUserSchema = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await deleteUserFunction(event.pathParameters as deleteUserSchema);

    return {
        statusCode: result.statusCode,
        body: result.body
    };

}

const deleteUserFunction = async (eventPathParameters: deleteUserSchema) => {
    const { userId } = eventPathParameters;

    const user = await prismaClient.user.delete({
        where: {
            id: userId
        },
    })

    return {
        statusCode: 200,
        body: JSON.stringify(UserMapper.toHttp(user)),
    };

}


