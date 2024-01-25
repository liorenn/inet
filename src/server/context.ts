import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { prisma } from '@/server/client'
import { clientEnv } from '@/utils/env'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

// Define a type for the options required to create the context
type CreateContextOptions = {
  session: Session | null
  supabase: SupabaseClient
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
export const createContext = (ctx: CreateNextContextOptions) => {
  const supabaseUrl = clientEnv.supabaseUrl
  const supabaseAnonKey = clientEnv.supabaseAnonKey

  // Create the Supabase server client
  const supabase = createPagesServerClient(ctx, {
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
  return createContextInner({
    supabase: supabase,
    session: null,
  })
}

// Define a type for the context based on the return type of the 'createContext' function
export type Context = inferAsyncReturnType<typeof createContext>
