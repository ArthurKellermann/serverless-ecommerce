import { User } from "@prisma/client";
import { prismaClient } from "../../src/common/database/prisma/prismaClient";

export async function createTestUsers(): Promise<User[]> {
    await prismaClient.user.createMany({
      data: [
        {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: 'johndoe123',
        },
        {
          name: 'Brad Pitt',
          email: 'bradpitt@email.com',
          password: 'bradpitt123',
        },
      ],
    });
  
    const createdUsers = await prismaClient.user.findMany();
  
    return createdUsers;
  }
  