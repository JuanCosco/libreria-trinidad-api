import * as CartRepository from "../repositories/cart.repository"
import * as BookRepository from "../repositories/book.repository"
import { AddToCartInput, UpdateCartItemInput } from "../types/cart.types"

const getOrCreateCart = async (userId: string) => {
    const cart = await CartRepository.findCartByUserId(userId)
    if (cart) return cart
    console.log(`[Cart] Creando nuevo carrito para usuario: ${userId}`)
    return CartRepository.createCart(userId)
}

export const getCart = async (userId: string) => {
    console.log(`[Cart] Obteniendo carrito del usuario: ${userId}`)
    const cart = await getOrCreateCart(userId)
    const total = cart.items.reduce((sum, item) => {
        const precio = Number(item.book.precio)
        const descuento = item.book.descuento ?? 0
        const precioFinal = precio - (precio * descuento) / 100
        return sum + precioFinal * item.cantidad
    }, 0)
    console.log(`[Cart] ${cart.items.length} item(s) | total: S/ ${total.toFixed(2)}`)
    return { ...cart, total: total.toFixed(2) }
}

export const addToCart = async (userId: string, input: AddToCartInput) => {
    console.log(`[Cart] Agregando libro ${input.bookId} al carrito de: ${userId}`)

    const book = await BookRepository.findById(input.bookId)
    if (!book) throw new Error("Libro no encontrado")
    if (!book.activo) throw new Error("Libro no disponible")

    const cart = await getOrCreateCart(userId)
    const existingItem = await CartRepository.findCartItem(cart.id, input.bookId)

    if (existingItem) {
        console.log(`[Cart] El libro ya está en el carrito, actualizando cantidad...`)
        const nuevaCantidad = existingItem.cantidad + input.cantidad
        return CartRepository.updateItem(cart.id, input.bookId, nuevaCantidad)
    }

    console.log(`[Cart] Libro agregado: ${book.nombre}`)
    return CartRepository.addItem(cart.id, input.bookId, input.cantidad)
}

export const updteCartItem = async (userId: string, bookId: string, input: UpdateCartItemInput) => {
    console.log(`[Cart] Actualizando cantidad del libro ${bookId} para usuario: ${userId}`)

    if (input.cantidad <= 0) throw new Error("La cantidad debe ser mayor a cero")

    const cart = await CartRepository.findCartByUserId(userId)
    if (!cart) throw new Error("Carrito no encontrado")

    const item = await CartRepository.findCartItem(cart.id, bookId)
    if (!item) throw new Error("Libro no encontrado en el carrito")

    const updated = await CartRepository.updateItem(cart.id, bookId, input.cantidad)
    console.log(`[Cart] Cantidad actualizada a: ${input.cantidad}`)
    return updated
}

export const removeFromCart = async (userId: string, bookId: string) => {
    console.log(`[Cart] Eliminando libro ${bookId} del carrito de: ${userId}`)

    const cart = await CartRepository.findCartByUserId(userId)
    if (!cart) throw new Error("Carrito no encontrado")

    const item = await CartRepository.findCartItem(cart.id, bookId)
    if (!item) throw new Error("Libro no encontrado en el carrito")

    await CartRepository.removeItem(cart.id, bookId)
    console.log(`[Cart] Libro eliminado del carrito`)
}

export const clearCart = async (userId: string) => {
    console.log(`[Cart] Limpiando carrito del usuario: ${userId}`)

    const cart = await CartRepository.findCartByUserId(userId)
    if (!cart) throw new Error("Carrito no encontrado")

    await CartRepository.clearCart(cart.id)
    console.log(`[Cart] Carrito limpiado`)
}