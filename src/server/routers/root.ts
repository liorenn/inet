import { adminRouter } from '~/src/server/routers/admin'
import { authRouter } from '@/server/routers/auth'
import { createTRPCRouter } from '@/server/trpc'
import { deviceRouter } from '@/server/routers/device'

// Create api routes handler
export const appRouter = createTRPCRouter({
  auth: authRouter,
  admin: adminRouter,
  device: deviceRouter
})

// Create type definition of API
export type AppRouter = typeof appRouter
