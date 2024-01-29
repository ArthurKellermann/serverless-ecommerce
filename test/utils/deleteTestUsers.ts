import { User } from "@prisma/client";
import { prismaClient } from "../../src/common/database/prisma/prismaClient";

export async function deleteTestUsers(users: User[]) {
    await prismaClient.user.deleteMany({
      where: {
        id: { in: users.map((user) => user.id) },
      },
    });
  }
  