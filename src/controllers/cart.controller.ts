import { Request, Response } from 'express'
import * as CartService from '../services/cart.service'

export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const cart = await CartService.getCart(req.user!.userId)
        res.status(200).json({ cart })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error desconocido"
        res.status(500).json({ error: message })
    }
}

export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await CartService.addToCart(req.user!.userId, req.body)
        res.status(200).json({ item })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error al agregar al carrito"
        res.status(400).json({ error: message })
    }
}

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = Array.isArray(req.params.bookId) ? req.params.bookId[0] : req.params.bookId
        const item = await CartService.updteCartItem(req.user!.userId, bookId, req.body)
        res.status(200).json({ item })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error al actualizar el carrito"
        res.status(400).json({ error: message })
    }
}

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = Array.isArray(req.params.bookId) ? req.params.bookId[0] : req.params.bookId
        await CartService.removeFromCart(req.user!.userId, bookId)
        res.status(200).json({ message: "Libro eliminado del carrito" })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error al eliminar del carrito"
        res.status(400).json({ error: message })
    }
}

export const clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
        await CartService.clearCart(req.user!.userId)
        res.status(200).json({ message: "Carrito limpiado" })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error al limpiar el carrito"
        res.status(500).json({ error: message })
    }
}