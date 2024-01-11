import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { SupabaseClient, Session } from '@supabase/supabase-js'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/server/client'

type CreateContextOptions = {
  session: Session | null
  supabase: SupabaseClient
}

export const createContextInner = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    supabase: opts.supabase,
    prisma,
  }
}

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  const supabase = createPagesServerClient({ req, res })
  const session = (await supabase.auth.getSession()).data.session

  return createContextInner({
    supabase: supabase,
    session: session,
  })
}

export type Context = inferAsyncReturnType<typeof createContext>
