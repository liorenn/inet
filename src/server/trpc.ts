import { initTRPC } from '@trpc/server' // Importing the initTRPC function from the trpc server
import superjson from 'superjson' // Importing the superjson library

import { type Context } from '@/server/context' // Importing the Context type from the server context

// Creating a TRPC context with the specified transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router // Exporting the router from the TRPC context
export const method = t.procedure // Exporting the method from the TRPC context

//const isAuthed = t.middleware(({ ctx, next }) => {
//   if (!ctx.session || !ctx.session.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' })
//   }
//   return next({
//     ctx: {
//       session: { ...ctx.session, user: ctx.session.user },
//     },
//   })
// })

// const isAdmin = t.middleware(({ ctx, next }) => {
//   if (!ctx.session || !ctx.session.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' })
//   }
//   return next({
//     ctx: {
//       session: { ...ctx.session, user: ctx.session.user },
//     },
//   })
// })

// const isManager = t.middleware(({ ctx, next }) => {
//   if (!ctx.session || !ctx.session.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' })
//   }
//   return next({
//     ctx: {
//       session: { ...ctx.session, user: ctx.session.user },
//     },
//   })
// })

// export const userMethod = t.procedure.use(isAuthed)
// export const adminMethod = t.procedure.use(isAdmin)
// export const managerMethod = t.procedure.use(isManager)
