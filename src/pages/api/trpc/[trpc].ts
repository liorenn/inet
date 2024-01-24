import type { TRPCError } from '@trpc/server'
import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/context'
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { env } from '@/server/env'

function convertErrorToString(error: TRPCError): string {
  return `Error code: ${error.code}, Message: ${error.message}` // Return error message
}

export default createNextApiHandler({
  // Create Next API handler
  router: appRouter,
  createContext,
  onError:
    env.websiteStatus === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path ?? 'unknown'}: ${convertErrorToString(error)}`) // Log error
        }
      : undefined,
})
