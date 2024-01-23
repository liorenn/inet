import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseServer, prisma } from '@/server/client'

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
export const createContext = (opts: CreateNextContextOptions) => {
  return createContextInner({
    supabase: createSupabaseServer(opts),
    session: null,
  })
}

export type Context = inferAsyncReturnType<typeof createContext>
