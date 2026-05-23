import prisma from "../utils/prisma";
import { CreateBookInput, UpdateBookInput } from "../types/book.types";

export const findAll = async () => {
    return prisma.book.findMany({
        where: { activo: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
};

export const findById = async (id: string) => {
    return prisma.book.findUnique({
        where: { id },
        include: { category: true },
    });
};

export const create = async (data: CreateBookInput) => {
    return prisma.book.create({
        data,
        include: { category: true },
    });
};

export const update = async (id: string, data: UpdateBookInput) => {
    return prisma.book.update({
        where: { id },
        data,
        include: { category: true },
    });
};

export const remove = async (id: string) => {
    return prisma.book.update({
        where: { id },
        data: { activo: false },
    });
};
