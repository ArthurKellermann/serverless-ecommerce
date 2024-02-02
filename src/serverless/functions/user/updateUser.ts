import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { UserMapper } from "../../../mappers/userMapper";
import { z } from "zod";
import { mergeBody } from "../../../common/utils/mergeBody";
import { errorHandlingHelper } from "src/common/utils/errorHandlingHelper";

const requestBody = z.object({
    name: z.string().optional(),
    email: z.string().email(),
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await updateUserFunction(event);

    return {
        statusCode: result.statusCode,
        body: result.body
    };
}

const updateUserFunction = async (event: APIGatewayProxyEvent) => {
    try {
        const { userId, ...data } = mergeBody(event);

        console.log(userId, data);

        requestBody.parse(data);

        const user = await prismaClient.user.update({
            data: {
                name: data.name,
                email: data.email,
            },
            where: {
                id: userId
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(UserMapper.toHttp(user))
        };

    } catch (error) {
        return errorHandlingHelper(error);

    }
}
