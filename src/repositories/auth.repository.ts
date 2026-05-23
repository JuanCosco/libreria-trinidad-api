import prisma from "../utils/prisma";
import { RegisterInput } from "../types/auth.types";

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: RegisterInput & { passwordHash: string }) => {
    return prisma.user.create({
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            passwordHash: data.passwordHash,
        },
    })
}