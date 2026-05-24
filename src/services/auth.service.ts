import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AuthRepository from "../repositories/auth.repository";
import { LoginInput, RegisterInput, JwtPayload } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (input: RegisterInput) => {
    const existingUser = await AuthRepository.findUserByEmail(input.email);
    if (existingUser) {
        throw new Error("Email ya registrado");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await AuthRepository.createUser({ ...input, passwordHash });
    console.log(`[Auth] Usuario registrado: ${user.email} | role: ${user.role}`)

    return {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role,
    };
};

export const login = async (input: LoginInput) => {
    console.log('1. Buscando usuario:', input.email)
    const user = await AuthRepository.findUserByEmail(input.email);
    console.log('2. Usuario encontrado:', user)
    if (!user) {
        throw new Error("Credenciales inválidas");
    }

    console.log('3. Comparando password...')
    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    console.log('4. Password válido:', validPassword)
    if (!validPassword) {
        throw new Error("Credenciales inválidas");
    }
    console.log('5. Generando token...')

    const payload: JwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    console.log(`[Auth] Login exitoso: ${user.email} | role: ${user.role}`)

    return {
        token,
        user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            role: user.role,
        },
    }
};
