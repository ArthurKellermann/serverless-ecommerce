import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../../common/database/prisma/prismaClient";
import { hashSync } from 'bcryptjs';
import { UserMapper } from "../../../mappers/userMapper";
import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(3, { message: 'Name must have at least 3 characters.' })
        .transform(name => name.toLocaleUpperCase()),
    email: z.string().email({ message: 'Enter a valid email.' }),
    password: z.string().min(8, { message: "Password must have at least 8 characters." }).max(20, { message: "Password must have at most 20 characters." })
});


type User = z.infer<typeof userSchema>;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { name, email, password } = JSON.parse(event.body!) as User;

    const data = {
        name,
        email,
        password: hashSync(password, 8)
    };

    const user = await prismaClient.user.create({
        data
    });

    return {
        statusCode: 200,
        body: JSON.stringify(UserMapper.toHttp(user))
    };
}