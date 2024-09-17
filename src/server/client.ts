import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import { env } from '@/server/env'

const createPrismaClient = () => new PrismaClient({})

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

export const resend = new Resend(env.resendKey)
