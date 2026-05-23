import * as BookRepository from '../repositories/book.repository'
import { CreateBookInput, UpdateBookInput } from '../types/book.types'

export const getAll = async () => {
    return BookRepository.findAll()
}

export const getById = async (id: string) => {
    const book = await BookRepository.findById(id)
    if (!book) {
        throw new Error('Book not found')
    }
    return book
}

export const create = async (input: CreateBookInput) => {
    return BookRepository.create(input)
}

export const update = async (id: string, input: UpdateBookInput) => {
    const book = await BookRepository.findById(id)
    if (!book) {
        throw new Error('Book not found')
    }
    return BookRepository.update(id, input)
}

export const remove = async (id: string) => {
    const book = await BookRepository.findById(id)
    if (!book) {
        throw new Error('Book not found')
    }
    return BookRepository.remove(id)
}