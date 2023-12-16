import { createNextApiHandler } from '@trpc/server/adapters/next'
import { createContext } from '../../../server/context'
import { appRouter } from '../../../server/routers/_app'
import type { TRPCError } from '@trpc/server'

// Define a function to convert TRPCError to string
function convertErrorToString(error: TRPCError): string {
  // Extract and format the relevant information from TRPCError
  const errorString = `Error code: ${error.code}, Message: ${error.message}`
  return errorString
}

// Export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          const errorString = convertErrorToString(error) // Convert TRPCError to string
          console.error(
            `❌ tRPC failed on ${path ?? 'unknown'}: ${errorString}`
          )
        }
      : undefined,
})
