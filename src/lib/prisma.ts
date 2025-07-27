import { PrismaClient } from "@prisma/client"
import { dev } from "$app/environment"

interface CustomGlobal {
    prisma?: PrismaClient 
}

const globalForPrisma = globalThis as CustomGlobal

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (dev) {
    globalForPrisma.prisma = prisma;
}