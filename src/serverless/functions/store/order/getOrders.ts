import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaClient } from '../../../../common/database/prisma/prismaClient';
import { OrderMapper } from '../../../../mappers/orderMapper';
import { Order } from "@prisma/client";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let result = await getOrdersFunction();

    return {
        statusCode: result.statusCode,
        body: result.body
    };
}

const getOrdersFunction = async () => {
    const orders = await prismaClient.order.findMany();

    const ordersMapped = await ordersFilter(orders);

    return {
        statusCode: 200,
        body: JSON.stringify(ordersMapped)
    }
};


const ordersFilter = async (orders: Order[]) => {
    const ordersMapped = [];

    for (const order of orders) {
        const user = await prismaClient.user.findUnique({
            where: {
                id: order.userId
            }
        });

        const product = await prismaClient.product.findUnique({
            where: {
                id: order.productId
            }
        });

        ordersMapped.push(OrderMapper.toHttp(order, user, product));
    }

    return ordersMapped;
}