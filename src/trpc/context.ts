import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '../utils/prisma-client'

type CreateContextOptions = {
  session: Session | null
}

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  }
}

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  // Get the session from the server using the unstable_getServerSession wrapper function
  const supabase = createServerSupabaseClient({ req, res })
  const session = (await supabase.auth.getSession()).data.session

  return await createContextInner({
    session: session,
  })
}

export type Context = inferAsyncReturnType<typeof createContext>
