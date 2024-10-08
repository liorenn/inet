import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '@/server/routers/root'
import superjson from 'superjson'
import { env } from '@/lib/clientEnv'

// Function to get the base URL based on the environment
function getBaseUrl() {
  if (typeof window !== 'undefined') return '' // If running in the browser, return an empty string
  return `https://${env.websiteUrl}` // If running on the server, return the website URL with https
}

// Creating a trpc instance for the AppRouter
export const api = createTRPCNext<AppRouter>({
  overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn()
        await opts.queryClient.invalidateQueries()
      }
    }
  },
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`, // Setting the URL for httpBatchLink based on the base URL
          transformer: superjson
        })
      ]
    }
  },
  transformer: superjson,
  ssr: false // Disabling server-side rendering
})

// Defining types for router inputs and outputs based on the AppRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
