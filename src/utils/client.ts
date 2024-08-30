import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '@/server/routers/_app'
import superjson from 'superjson'
import { createClient } from '@supabase/supabase-js'
import { clientEnv } from '@/utils/env'

// Creating a Supabase client using the environment variables
export const supabase = createClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey)

// Function to get the base URL based on the environment
function getBaseUrl() {
  if (typeof window !== 'undefined') return '' // If running in the browser, return an empty string
  return `https://${clientEnv.websiteUrl}` // If running on the server, return the website URL with https
}

// Creating a trpc instance for the AppRouter
export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson, // Using superjson as the transformer
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`, // Setting the URL for httpBatchLink based on the base URL
        }),
      ],
    }
  },
  ssr: false, // Disabling server-side rendering
})

// Defining types for router inputs and outputs based on the AppRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
