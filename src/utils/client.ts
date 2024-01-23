//import { createClient } from '@supabase/supabase-js'

import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '@/server/routers/_app'
import superjson from 'superjson'
import { createClient } from '@supabase/supabase-js'
import { clientEnv } from '@/utils/env'

export const supabase = createClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey)

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  return `https://${clientEnv.websiteUrl}`
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }
  },
  ssr: false,
})

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
