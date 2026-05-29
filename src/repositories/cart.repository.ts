import prisma from "../utils/prisma";

export const findCartByUserId = async (userId: string) => {
    return prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: { book: { include: { category: true } } },
            },
        },
    });
};

export const createCart = async (userId: string) => {
    return prisma.cart.create({
        data: { userId },
        include: {
            items: {
                include: { book: { include: { category: true } } },
            },
        },
    })
}

export const findCartItem = async (cartId: string, bookId: string) => {
    return prisma.cartItem.findUnique({
        where: { cartId_bookId: { cartId, bookId } },
    })
}

export const addItem = async (cartId: string, bookId: string, cantidad: number) => {
    return prisma.cartItem.create({
        data: { cartId, bookId, cantidad },
        include: { book: true },
    })
}

export const updateItem = async (cartId: string, bookId: string, cantidad: number) => {
    return prisma.cartItem.update({
        where: { cartId_bookId: { cartId, bookId } },
        data: { cantidad },
        include: { book: true },
    })
}

export const removeItem = async (cartId: string, bookId: string) => {
    return prisma.cartItem.delete({
        where: { cartId_bookId: { cartId, bookId } },
    })
}

export const clearCart = async (cartId: string) => {
    return prisma.cartItem.deleteMany({ where: { cartId } })
}