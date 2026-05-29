export type OrderStatus = "PENDING" | "PAID" | "CANCELLED"

export interface CreateOrderInput {
    userId: string
    items: {
        bookId: string
        nombreSnapshot: string
        precioSnapshot: number
        cantidad: number
    }[]
    total: number
}