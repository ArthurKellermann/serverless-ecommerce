import { User as PrismaUserEntity } from "@prisma/client";

export interface UserHttpInterface {
    id: string;
    name: string;
    email: string;
}

export class UserMapper {
    static toHttp(user: PrismaUserEntity): UserHttpInterface {
        return {
            id: user.id!,
            name: user.name,
            email: user.email
        };
    }

    static toHttpList(users: PrismaUserEntity[]): UserHttpInterface[] {
        return users.map(user => this.toHttp(user));
    }
}
