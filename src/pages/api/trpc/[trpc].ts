import type { TRPCError } from '@trpc/server'
import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/trpc'
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { env } from '@/server/env'

// Convert error to string
function convertErrorToString(error: TRPCError): string {
  return `Error code: ${error.code}, Message: ${error.message}` // Return error message
}

// Create Next API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  // On operation error
  onError:
    env.websiteStatus === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path ?? 'unknown'}: ${convertErrorToString(error)}`) // Log the error
        }
      : undefined,
})
