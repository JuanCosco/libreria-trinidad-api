import { Request, Response } from 'express'
import * as AuthService from '../services/auth.service'

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await AuthService.register(req.body)
        res.status(201).json({ user })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al registrar'
        res.status(400).json({ error: message })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await AuthService.login(req.body)
        res.status(200).json(result)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
        res.status(400).json({ error: message })
    }
}