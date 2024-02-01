import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { hashSync } from 'bcryptjs';
import { UserMapper } from "../../../mappers/userMapper";
import { z } from "zod";

const requestBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8).max(20)
});

type User = z.infer<typeof requestBody>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await registerUserLogic(event.body);

    return {
        statusCode: result.statusCode,
        body: result.body,
    };
}

const registerUserLogic = async (eventBody: string): Promise<APIGatewayProxyResult> => {
    try {
        const { name, email, password } = JSON.parse(eventBody!) as User;
        requestBody.parse({ name, email, password });

        const user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 8),
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(UserMapper.toHttp(user)),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request.' }),
        };

    }
}
