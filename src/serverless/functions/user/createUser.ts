import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from "../../database/prisma/prismaClient";
import { hashSync } from 'bcryptjs';

class UserDto {
    name: string;
    email: string;
    password: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { name, email, password } = JSON.parse(event.body!) as UserDto; 

    const data = {
        name,
        email,
        password: hashSync(password, 8)
    };

    const user = await prismaClient.user.create({
        data: {
            name,
            email
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ user })
    };
}