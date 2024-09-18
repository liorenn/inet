import { UpdateSchema, commentSchema, userSchema } from '@/models/schemas'
import { hash, verify } from '@node-rs/argon2'
import { method, protectedMethod, unAuthedMethod } from '@/server/trpc'

import { Prisma } from '@prisma/client'
import { createTRPCRouter } from '@/server/trpc'
import { encodeEmail } from '@/lib/utils'
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { generateIdFromEntropySize } from 'lucia'
import { lucia } from '@/server/auth'
import { z } from 'zod'

// Create a auth router
export const authRouter = createTRPCRouter({
  getUser: method.query(({ ctx }) => {
    return ctx.user
  }),
  signUp: unAuthedMethod.input(userSchema.omit({ role: true })).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({ where: { email: input.email } })
    if (user) return { error: true, message: 'Email already exists', user: null }
    const passwordHash = await hash(input.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    })
    const userId = generateIdFromEntropySize(10)
    await ctx.db.user.create({
      data: {
        ...input,
        id: userId,
        role: 'user',
        password: passwordHash
      }
    })
    const session = await lucia.createSession(userId, {})
    ctx.res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
    return { error: false, message: 'User Signed Up Successfully', user: ctx.user }
  }),
  signIn: unAuthedMethod
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { email: input.email } })
      if (!user) return { error: true, message: 'Incorrect Email or Password', user: null }
      const validPassword = await verify(user.password, input.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      })
      if (!validPassword) return { error: true, message: 'Incorrect Email or Password' }
      const session = await lucia.createSession(user.id, {})
      ctx.res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
      return { error: false, message: 'User Signed In Successfully', user: ctx.user }
    }),
  signOut: protectedMethod.mutation(async ({ ctx }) => {
    if (!ctx.user || !ctx.session) return { error: true, message: 'User Not Found' }
    await lucia.invalidateSession(ctx.session.id)
    ctx.res.setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
    return { error: false, message: 'User Signed Out Successfully' }
  }),
  // Function to check if an image exists
  isImageExists: protectedMethod.input(z.object({ email: z.string() })).mutation(({ input }) => {
    const path = `public/users/${encodeEmail(input.email)}.png` // The path to the image
    return existsSync(path) // Return if the image exists
  }),
  // Function to get the email of a comment
  getCommentEmail: protectedMethod
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.db.user.findFirst({
        where: { username: input.username }
      }) // Get the comment whose username is the input
      return comment?.email // Return the email of the comment
    }),
  // Function to check if a comment image exists
  isCommentImageExists: protectedMethod
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.db.user.findFirst({
        where: { username: input.username }
      }) // Get the comment whose username is the input
      // If comment exists return if the image exists
      return comment?.email ? existsSync(`public/users/${encodeEmail(comment?.email)}.png`) : false
    }),
  // Function to edit a comment
  editComment: protectedMethod
    .input(
      z.object({
        commentId: z.number(),
        message: z.string(),
        rating: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.update({
        where: { id: input.commentId },
        data: {
          message: input.message,
          rating: input.rating
        }
      }) // Update the comment whose id is the input
      return comments // Return the updated comments
    }),
  // Function to delete a comment
  deleteComment: protectedMethod
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.delete({
        where: { id: input.commentId }
      }) // Delete the comment whose id is the input
      return comments // Return the deleted comments
    }),
  // Function to create a comment
  addComment: protectedMethod.input(commentSchema).mutation(async ({ ctx, input }) => {
    const { createdAt, message, model, rating, updatedAt, username } = input // Destructure the input
    const comment = await ctx.db.comment.create({
      data: {
        message,
        rating,
        updatedAt,
        createdAt,
        model,
        username
      }
    }) // Create a new comment
    return comment // Return the comment
  }),
  // Function to get all comments
  getAllComments: protectedMethod
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.findMany({
        where: { model: input.model }
      }) // Get all comments for the model
      return comments // Return the comments
    }),
  updateUserProperty: protectedMethod
    .input(z.object({ property: UpdateSchema, email: z.string(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let value = input.value
      if (input.property === 'password') {
        const passwordHash = await hash(input.value, {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1
        })
        value = passwordHash
      }
      const details = await ctx.db.user.update({
        where: { email: input.email },
        data: {
          [input.property]: value
        }
      })
      return details
    }),
  // Function to update a user
  updateUserDetails: method
    .input(
      z.object({
        property: UpdateSchema,
        email: z.string(),
        value: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = { [input.property]: input.value }
      const details = await ctx.db.user.update({
        where: { email: input.email },
        data: update
      })
      return details
    })
})
