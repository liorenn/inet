import { createNextApiHandler } from '@trpc/server/adapters/next'
import { createContext } from '../../../trpc/context'
import { appRouter } from '../../../trpc/routers/_app'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.log(`❌ tRPC failed on ${path}: ${error}`)
        }
      : undefined,
})
