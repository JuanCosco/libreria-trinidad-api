import prisma from "../utils/prisma"
import { CreateOrderInput } from "../types/order.types"

export const findAllByUserId = async (userId: string) => {
    return prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { fecha: "desc" }
    })
}

export const findById = async (id: string) => {
    return prisma.order.findUnique({
        where: { id },
        include: { items: true }
    })
}

export const findAll = async () => {
    return prisma.order.findMany({
        include: { items: true, user: true },
        orderBy: { fecha: "desc" }
    })
}

export const create = async (input: CreateOrderInput) => {
    return prisma.order.create({
        data: {
            userId: input.userId,
            total: input.total,
            status: "PENDING",
            fecha: new Date(),
            paypalTransactionId: `SIM-${Date.now()}`,
            payerEmail: "",
            payerId: "",
            items: {
                create: input.items.map((item) => ({
                    bookId: item.bookId,
                    nombreSnapshot: item.nombreSnapshot,
                    precioSnapshot: item.precioSnapshot,
                    cantidad: item.cantidad
                })),
            },
        },
        include: { items: true }
    })
}

export const updateStatus = async(id: string, status: string) => {
    return prisma.order.update({
        where: { id },
        data: { status },
    })
}