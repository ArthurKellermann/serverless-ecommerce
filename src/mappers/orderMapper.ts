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

