import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/trpc'
import { createNextApiHandler } from '@trpc/server/adapters/next'

// Create Next API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
})
