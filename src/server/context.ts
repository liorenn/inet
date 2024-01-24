import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { prisma } from '@/server/client'

// Define a type for the options required to create the context
type CreateContextOptions = {
  session: Session | null
  supabase: SupabaseClient | null
}

// Define a function that creates the context based on the provided options
const createContextInner = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    supabase: opts.supabase,
    prisma,
  }
}

// Export a function that creates the context based on the provided Next.js context options
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = (_ctx: CreateNextContextOptions) => {
  return createContextInner({
    supabase: null,
    session: null,
  })
}

// Define a type for the context based on the return type of the 'createContext' function
export type Context = inferAsyncReturnType<typeof createContext>
