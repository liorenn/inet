import { initTRPC } from '@trpc/server' // Importing the initTRPC function from the trpc server
import superjson from 'superjson' // Importing the superjson library

import { type Context } from '@/server/context' // Importing the Context type from the server context

// Creating a TRPC context with the specified transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router // Exporting the router from the TRPC context
export const method = t.procedure // Exporting the method from the TRPC context
