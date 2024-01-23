import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import { env } from '@/server/env'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export function createSupabaseServer(opts: CreateNextContextOptions) {
  return createPagesServerClient(opts)
}

export const prisma = global.prisma || new PrismaClient()

if (env.websiteStatus !== 'production') {
  global.prisma = prisma
}

export const resend = new Resend(env.resendKey)
