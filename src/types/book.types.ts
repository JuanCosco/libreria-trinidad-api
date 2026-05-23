export interface CreateBookInput {
    nombre: string
    descripcion: string
    precio: number
    descuento?: number
    categoryId: string
}

export interface UpdateBookInput {
    nombre?: string
    descripcion?: string
    precio?: number
    descuento?: number
    activo?: boolean
    categoryId?: string
}