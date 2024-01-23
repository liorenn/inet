import type { TRPCError } from '@trpc/server'
import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/context'
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { env } from '@/server/env'

function convertErrorToString(error: TRPCError): string {
  const errorString = `Error code: ${error.code}, Message: ${error.message}`
  return errorString
}

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.websiteStatus === 'development'
      ? ({ path, error }) => {
          const errorString = convertErrorToString(error)
          console.error(`❌ tRPC failed on ${path ?? 'unknown'}: ${errorString}`)
        }
      : undefined,
})
