// Seu teste E2E
import { callLocalLambda } from '../utils/lambdaLocalInstance';
import { getUsers } from '../../src/serverless/functions/user/index';
import { createTestUsers } from '../utils/createTestUsers';
import { deleteTestUsers } from '../utils/deleteTestUsers';
import { User } from '@prisma/client';

describe("Users - Integration", () => {
  let users: User[];

  beforeEach(async () => {
    users = await createTestUsers();
  });

  afterAll(async () => {
    await deleteTestUsers(users);
  });

  it("should get all users successfully", async () => {
    const event = {};
    
    const response = await callLocalLambda('serverless-ecommerce-dev-getUsers', event);
  
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expect.arrayContaining([{ id: expect.anything() }]));
  });
  
});
