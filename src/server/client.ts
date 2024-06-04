import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import { env } from '@/server/env'

// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined
// }

// export const prisma = global.prisma || new PrismaClient() // Initialize Prisma client

// global.prisma = prisma // Store in global object

export const resend = new Resend(env.resendKey) // Initialize Resend client

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

globalForPrisma.prisma = prisma
