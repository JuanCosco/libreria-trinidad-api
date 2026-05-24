import * as CategoryRepository from '../repositories/category.repository'
import { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types'

export const getAll = async () => {
    console.log("[Categories] Obteniendo todas las categorías")
    const categories = await CategoryRepository.findAll()
    console.log(`[Categories] Se encontraron ${categories.length} categorías`)
    return categories
}

export const getById = async (id: string) => {
    console.log(`[Categories] Obteniendo categoría con ID: ${id}`)
    const category = await CategoryRepository.findById(id)
    if (!category) {
        console.warn(`[Categories] No se encontró la categoría con ID: ${id}`)
        throw new Error('Categoría no encontrada')
    }
    console.log(`[Categories] Se encontró la categoría: ${category.nombre}`)
    return category
}

export const create = async (data: CreateCategoryInput) => {
    console.log(`[Categories] Creando nueva categoría con nombre: ${data.nombre}`)
    const category = await CategoryRepository.create(data)
    console.log(`[Categories] Se creó la categoría con ID: ${category.id}`)
    return category
}

export const update = async (id: string, input: UpdateCategoryInput) => {
    console.log(`[Categories] Actualizando categoría con ID: ${id}`)
    const category = await CategoryRepository.findById(id)
    if (!category) {
        console.warn(`[Categories] No se encontró la categoría con ID: ${id} para actualizar`)
        throw new Error('Categoría no encontrada')
    }
    const updatedCategory = await CategoryRepository.update(id, input)
    console.log(`[Categories] Se actualizó la categoría con ID: ${id}`)
    return updatedCategory
}

export const remove = async (id: string) => {
    console.log(`[Categories] Eliminando categoría id: ${id}`)
    const category = await CategoryRepository.findById(id)
    if (!category) {
        console.warn(`[Categories] Categoría no encontrada para eliminar id: ${id}`)
        throw new Error('Categoría no encontrada')
    }
    await CategoryRepository.remove(id)
    console.log(`[Categories] Categoría eliminada: ${category.nombre}`)
}