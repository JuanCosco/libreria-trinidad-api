import prisma from "../utils/prisma"
import { CreateCategoryInput, UpdateCategoryInput } from "../types/category.types"

export const findAll = async () => {
    return prisma.category.findMany({ orderBy: { nombre: 'asc' } })
}

export const findById = async (id: string) => {
    return prisma.category.findUnique({ where: { id } })
}

export const create = async (data: CreateCategoryInput) => {
    return prisma.category.create({ data })
}

export const update = async (id: string, data: UpdateCategoryInput) => {
    return prisma.category.update({ where: { id }, data })
}

export const remove = async (id: string) => {
    return prisma.category.delete({ where: { id } })
}