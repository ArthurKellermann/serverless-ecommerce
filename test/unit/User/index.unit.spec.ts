import { APIGatewayProxyEvent } from 'aws-lambda';
import { registerUser } from '../../../src/serverless/functions/user/index';
import { prismaClient } from '../../../src/common/database/prisma/prismaClient';

jest.mock('../../../src/common/database/prisma/prismaClient');

describe('registerUser - Unit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a user successfully', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            }),
        } as APIGatewayProxyEvent;

        const createMock = jest
            .spyOn(prismaClient.user, 'create')
            .mockResolvedValueOnce({
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
            });

        const result = await registerUser(event);

        expect(createMock).toHaveBeenCalledWith({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: expect.any(String),
            },
        });

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toMatchObject({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
        });
    });

});
