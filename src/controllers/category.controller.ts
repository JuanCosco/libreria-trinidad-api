import { Request, Response } from 'express'
import * as CategoryService from '../services/category.service'

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await CategoryService.getAll()
        res.status(200).json({ categories })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al obtener categorías'
        res.status(500).json({ error: message })
    }
}

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const category = await CategoryService.getById(id)
        res.status(200).json({ category })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al obtener categoría'
        res.status(404).json({ error: message })
    }
}

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await CategoryService.create(req.body)
        res.status(201).json({ category })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al crear categoría'
        res.status(400).json({ error: message })
    }
}

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const category = await CategoryService.update(id, req.body)
        res.status(200).json({ category })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al actualizar categoría'
        res.status(400).json({ error: message })
    }
}

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        await CategoryService.remove(id)
        res.status(200).json({ message: 'Categoría eliminada correctamente' })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al eliminar categoría'
        res.status(400).json({ error: message })
    }
}