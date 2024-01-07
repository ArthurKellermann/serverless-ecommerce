import { User as PrismaUser } from "@prisma/client";

export interface UserHttp {
    id: string;
    name: string;
    email: string;
}

export class UserMapper {
    static toHttp(user: PrismaUser): UserHttp {
        return {
            id: user.id!,
            name: user.name,
            email: user.email
        };
    }

    static toHttpList(users: PrismaUser[]): UserHttp[] {
        return users.map(user => this.toHttp(user));
    }
}
