import { Request, Response } from 'express'
import * as OrderService from '../services/order.service'

export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await OrderService.getMyOrders(req.user!.userId)
        res.status(200).json({ orders })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al obtener órdenes'
        res.status(500).json({ message })
    }
}

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const order = await OrderService.getById(id, req.user!.userId, req.user!.role)
        res.status(200).json({ order })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al obtener la orden'
        const status = message === 'Orden no encontrada' ? 403 : 404
        res.status(status).json({ message })
    }
}

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const orders = await OrderService.getAll()
        res.status(200).json({ orders })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al obtener órdenes'
        res.status(500).json({ message })
    }
}

export const createFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await OrderService.createFromCart(req.user!.userId)
        res.status(201).json({ order })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al crear la orden'
        res.status(400).json({ message })
    }
}

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const order = await OrderService.updateStatus(id, req.body.status)
        res.status(200).json({ order })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al actualizar el estado de la orden'
        res.status(400).json({ message })
    }
}