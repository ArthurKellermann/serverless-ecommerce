import { Order as PrismaOrderEntity } from "@prisma/client";
import { User as PrismaUserEntity } from "@prisma/client";
import { Product as PrismaProductEntity } from "@prisma/client";

export interface OrderHttpInterface {
    id: string,
    quantity: number,
    user: {
        userId: string,
        name: string,
        email: string,
    },
    product: {
        productId: string,
        name: string,
    }
}

export class OrderMapper {
    static toHttp(
        order: PrismaOrderEntity,
        user: PrismaUserEntity,
        product: PrismaProductEntity
    ): OrderHttpInterface {
        return {
            id: order.id,
            quantity: order.quantity,
            user: {
                userId: user.id,
                name: user.name,
                email: user.email,
            },
            product: {
                productId: product.id,
                name: product.name,
            }

        };
    }

    static toHttpList(orders: PrismaOrderEntity[], user: PrismaUserEntity, product: PrismaProductEntity): OrderHttpInterface[] {
        return orders.map(order => this.toHttp(order, user, product));
    }
}
