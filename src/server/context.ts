import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { prisma, supabase } from '@/server/client'

type CreateContextOptions = {
  session: Session | null
  supabase: SupabaseClient
}

const createContextInner = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    supabase: opts.supabase,
    prisma,
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = (_opts: CreateNextContextOptions) => {
  return createContextInner({
    supabase: supabase,
    session: null,
  })
}

export type Context = inferAsyncReturnType<typeof createContext>
