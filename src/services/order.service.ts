import * as OrderRepository from '../repositories/order.repository'
import * as CartRepository from '../repositories/cart.repository'

export const getMyOrders = async (userId: string) => {
    console.log(`[Orders] Obteniendo órdenes del usuario: ${userId}`)
    const orders = await OrderRepository.findAllByUserId(userId)
    console.log(`[Orders] ${orders.length} orden(es) encontrada(s)`)
    return orders
}

export const getById = async (id: string, userId: string, role: string) => {
    console.log(`[Orders] Buscando orden id: ${id}`)
    const order = await OrderRepository.findById(id)
    if (!order) throw new Error('Orden no encontrada')

    // Cliente solo puede ver sus propias órdenes, admin puede ver todas
    if (role !== "ADMIN" && order.userId !== userId) {
        console.warn(`[Orders] Usuario ${userId} no tiene permiso para ver orden id: ${id}`)
        throw new Error('No tienes permiso para ver esta orden')
    }

    return order
}

export const getAll = async () => {
    console.log(`[Orders] Obteniendo todas las órdenes (ADMIN)`)
    const orders = await OrderRepository.findAll()
    console.log(`[Orders] ${orders.length} orden(es) encontrada(s)`)
    return orders
}

export const createFromCart = async (userId: string) => {
    console.log(`[Orders] Creando orden a partir del carrito del usuario: ${userId}`)

    const cart = await CartRepository.findCartByUserId(userId)
    if (!cart || cart.items.length === 0) {
        console.warn(`[Orders] Carrito vacío para el usuario: ${userId}`)
        throw new Error('No tienes productos en el carrito para crear una orden')
    }

    const items = cart.items.map((item) => {
        const precio = Number(item.book.precio)
        const descuento = item.book.descuento ?? 0
        const precioFinal = precio - (precio * descuento / 100)
        return {
            bookId: item.book.id,
            nombreSnapshot: item.book.nombre,
            precioSnapshot: precioFinal,
            cantidad: item.cantidad,
        }
    })

    const total = items.reduce((sum, item) => sum + (item.precioSnapshot * item.cantidad), 0)

    const order = await OrderRepository.create({ userId, items, total})
    console.log(`[Orders] Orden creada id: ${order.id} | total: S/ ${total.toFixed(2)}`)

    // Limpiar el carrito después de crear la orden
    await CartRepository.clearCart(userId)
    console.log(`[Orders] Carrito vaciado tras crear orden`)

    return order
}

export const updateStatus = async (id: string, status: string) => {
    console.log(`[Orders] Actualizando estado de la orden id: ${id} a ${status}`)
    const order = await OrderRepository.findById(id)
    if(!order) throw new Error('Orden no encontrada')

    const updated = await OrderRepository.updateStatus(id, status)
    console.log(`[Orders] Estado actualizado correctamente`)
    return updated
}