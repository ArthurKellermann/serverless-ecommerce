import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { UserMapper } from "../../../mappers/userMapper";
import { z } from "zod";

const requestBody = z.object({
    name: z.string().min(3, { message: 'Name must have at least 3 characters.' })
        .transform(name => name.toLocaleUpperCase()),
    email: z.string().email({ message: 'Enter a valid email.' }),
});

const requestParams = z.object({
    userId: z.string().uuid({ message: 'Enter a valid UUID' })
});

type UpdateUserSchema = z.infer<typeof requestBody>;
type UpdateUserParams = z.infer<typeof requestParams>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const data = JSON.parse(event.body!) as UpdateUserSchema;
        const { userId } = event.pathParameters as UpdateUserParams;

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
