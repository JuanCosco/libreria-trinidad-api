export interface RegisterInput {
    nombre: string
    apellido: string
    email: string
    password: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface JwtPayload {
    userId: string
    role: string
    iat?: number
    exp?: number
}
