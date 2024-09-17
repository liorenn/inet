import { Prisma, PrismaClient } from '@prisma/client'
import { UpdateSchema, commentSchema, userSchema } from '@/models/schemas'
import { calculatePercentageDiff, encodeEmail } from '@/utils/utils'
import { hash, verify } from '@node-rs/argon2'
import { method, protectedMethod } from '@/server/trpc'

import PriceDropEmail from '@/components/misc/PriceDropEmail'
import { createTRPCRouter } from '../trpc'
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { generateIdFromEntropySize } from 'lucia'
import { lucia } from '@/server/auth'
import { resend } from '@/server/client'
import { z } from 'zod'

// The data type for the backupDatabase function
export type allDataType = {
  table: string
  data: Record<string, unknown>[]
}[]

// Create a auth router
export const authRouter = createTRPCRouter({
  getUser: method.query(({ ctx }) => {
    return ctx.user
  }),
  signUp: method.input(userSchema.omit({ accessKey: true })).mutation(async ({ ctx, input }) => {
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
        accessKey: 1,
        password: passwordHash
      }
    })

    const session = await lucia.createSession(userId, {})
    ctx.res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
    return { error: false, message: 'User Signed Up Successfully', user: ctx.user }
  }),
  signIn: method
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { email: input.email } })
      if (!user) return { error: true, message: 'Incorrect Email or Password', user: null }
      const validPassword = verify(user.password, input.password, {
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
  // Function to open the database editor
  openDatabaseEditor: method
    .input(
      z
        .object({
          databaseEditorPort: z.number()
        })
        .default({ databaseEditorPort: 3000 })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(`http://localhost:${input.databaseEditorPort}/`) // Send request to database editor if it exists
        await response.text() // Convert response
        return false // Database editor exists so return false
      } catch {
        exec(
          `npx prisma studio --port ${input.databaseEditorPort} --browser none --schema=./prisma/schema.prisma`
        ) // Open database editor by running the command in the terminal
        return true // Database editor does not exist so return true
      }
    }),
  // Function to close the database editor
  closeDatabaseEditor: method
    .input(
      z
        .object({
          databaseEditorPort: z.number()
        })
        .default({ databaseEditorPort: 3000 })
    )
    .mutation(({ input }) => {
      try {
        exec(
          `for /f "tokens=5" %a in ('netstat -aon ^| find ":${input.databaseEditorPort}" ^| find "LISTENING"') do taskkill /f /pid %a`
        ) // Close database editor by running the command in the terminal
        return true // Database editor exists so return true
      } catch {
        return false // Database editor does not exist so return false
      }
    }),
  // Function to insert a user
  insertUser: method.input(userSchema).mutation(async ({ ctx, input }) => {
    try {
      const userId = generateIdFromEntropySize(10)
      await ctx.db.user.create({
        data: {
          id: userId,
          ...input,
          comments: { create: [] },
          deviceList: { create: [] }
        }
      }) // Create the user
      return true // Return true to indicate operation success
    } catch {
      return false // Return false to indicate operation failure
    }
  }),
  // Function to update a user
  updateUser: method.input(userSchema).mutation(async ({ ctx, input }) => {
    try {
      await ctx.db.user.update({
        where: { email: input.email },
        data: {
          ...input
        }
      }) // Update the user
      return true // Return true to indicate operation success
    } catch {
      return false // Return false to indicate operation failure
    }
  }),
  // Function to delete a user
  deleteUser: method
    .input(
      z.object({
        email: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.delete({
          where: { email: input.email }
        }) // Delete the user
        return true // Return true to indicate operation success
      } catch {
        return false // Return false to indicate operation failure
      }
    }),
  // Get all user tables properties
  getUserProperties: method.query(() => {
    return Prisma.dmmf.datamodel.models.find((model) => model.name === 'User') // Get user table columns
  }),
  // Function to get all tables properties
  getTablesProperties: method.query(() => {
    return Prisma.dmmf.datamodel.models // Get tables properties from prisma client
  }),
  // Function to get all data from a table
  getTableData: method
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const selectQuery = `SELECT * FROM \"${input.tableName}\"` // Build a select query
      return await ctx.db.$queryRawUnsafe(selectQuery) // Send the query to the database
    }),
  // Function to get all users data
  getUsersData: method.query(async ({ ctx }) => {
    return await ctx.db.user.findMany() // Get all users from the database
  }),
  // Function to check if an image exists
  isImageExists: method.input(z.object({ email: z.string() })).mutation(({ input }) => {
    const path = `public/users/${encodeEmail(input.email)}.png` // The path to the image
    return existsSync(path) // Return if the image exists
  }),
  // Function to get the email of a comment
  getCommentEmail: method
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.db.user.findFirst({
        where: { username: input.username }
      }) // Get the comment whose username is the input
      return comment?.email // Return the email of the comment
    }),
  // Function to check if a comment image exists
  isCommentImageExists: method
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.db.user.findFirst({
        where: { username: input.username }
      }) // Get the comment whose username is the input
      // If comment exists return if the image exists
      return comment?.email ? existsSync(`public/users/${encodeEmail(comment?.email)}.png`) : false
    }),
  // Function to edit a comment
  editComment: method
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
  deleteComment: method
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.delete({
        where: { id: input.commentId }
      }) // Delete the comment whose id is the input
      return comments // Return the deleted comments
    }),
  // Function to create a comment
  addComment: method.input(commentSchema).mutation(async ({ ctx, input }) => {
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
  getAllComments: method.input(z.object({ model: z.string() })).query(async ({ ctx, input }) => {
    const comments = await ctx.db.comment.findMany({
      where: { model: input.model }
    }) // Get all comments for the model
    return comments // Return the comments
  }),
  // Function to get a user
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
    }),
  // Function to get a user
  getAccessKey: method
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.email === undefined) return 0 // If no email is provided return zero
      const user = await ctx.db.user.findFirst({
        where: { email: input.email }
      }) // Get the user whose email matches the input
      return user?.accessKey // Return the access key of the user
    }),
  // Function to create a user
  createUser: method
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        username: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = generateIdFromEntropySize(10)
      return await ctx.db.user.create({
        data: {
          id: userId,
          email: input.email,
          name: input.name,
          phone: input.phone,
          password: input.password,
          username: input.username,
          comments: { create: [] },
          deviceList: { create: [] }
        }
      })
    }),
  // Function to get a user
  IsSignUpUserExists: method
    .input(
      z.object({
        email: z.string(),
        username: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEmail = await ctx.db.user.findFirst({
        where: { email: input.email }
      }) // Get the user whose email matches the input
      const usernameUser = await ctx.db.user.findFirst({
        where: { username: input?.username }
      }) // Get the user whose username matches the input
      return {
        email: !!userEmail,
        username: !!usernameUser && (userEmail ? userEmail.username === input?.username : true)
      }
    })
})
