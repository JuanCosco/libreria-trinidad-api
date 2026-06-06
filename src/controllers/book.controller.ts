import { Request, Response } from "express";
import * as BookService from "../services/book.service";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const books = await BookService.getAll();
        res.status(200).json({ books });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Error al obtener libros";
        res.status(500).json({ message });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const book = await BookService.getById(id);
        res.status(200).json({ book });
    } catch (error: unknown) {
        const message =  error instanceof Error ? error.message : "Error al obtener libro";
        const status = message === "Libro no encontrado" ? 404 : 400; // ← diferencia 404 de 400
        res.status(status).json({ error: message });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await BookService.create(req.body);
        res.status(201).json({ book });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Error al crear libro";
        res.status(400).json({ error: message });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const book = await BookService.update(id, req.body);
        res.status(200).json({ book });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Error al actualizar libro";
        res.status(400).json({ error: message });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await BookService.remove(id);
        res.status(200).json({ message: "Libro desactivado correctamente" });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Error al eliminar libro";
        res.status(400).json({ error: message });
    }
};
