import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

import { type Context } from '@/server/context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router

export const method = t.procedure

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
