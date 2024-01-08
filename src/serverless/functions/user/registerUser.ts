import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { hashSync } from 'bcryptjs';
import { UserMapper } from "../../../mappers/userMapper";
import { z } from "zod";

const requestBody = z.object({
    name: z.string().min(3, { message: 'Name must have at least 3 characters.' })
        .transform(name => name.toLocaleUpperCase()),
    email: z.string().email({ message: 'Enter a valid email.' }),
    password: z.string().min(8, { message: 'Password must have at least 8 characters.' }).max(20, { message: 'Password must have at most 20 characters.' })
});


type User = z.infer<typeof requestBody>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { name, email, password } = JSON.parse(event.body!) as User;
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
            body: JSON.stringify(UserMapper.toHttp(user))
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request.', details: error.errors }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request.' }),
            };
        }
    }
}
