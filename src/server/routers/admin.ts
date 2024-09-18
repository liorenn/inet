import { UserRole, userSchema } from '@/models/schemas'
import { adminMethod, createTRPCRouter } from '@/server/trpc'

import { Prisma } from '@prisma/client'
import { generateIdFromEntropySize } from 'lucia'
import { managerMethod } from '@/server/trpc'
import { seedDatabase } from '~/prisma/seed'
import { z } from 'zod'

// Create a admin router
export const adminRouter = createTRPCRouter({
  // Function to seed the database
  seedDevicesData: adminMethod.mutation(() => {
    seedDatabase()
  }),
  // Function to insert a user
  insertUser: managerMethod.input(userSchema).mutation(async ({ ctx, input }) => {
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
  updateUser: managerMethod.input(userSchema).mutation(async ({ ctx, input }) => {
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
  deleteUser: managerMethod
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
  // Function to get all tables properties
  getTablesProperties: managerMethod.query(() => {
    return Prisma.dmmf.datamodel.models // Get tables properties from prisma client
  }),
  // Function to get all data from a table
  getTableData: managerMethod
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const selectQuery = `SELECT * FROM \"${input.tableName}\"` // Build a select query
      return await ctx.db.$queryRawUnsafe(selectQuery) // Send the query to the database
    }),
  // Function to get all users data
  getUsersData: managerMethod.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany() // Get all users from the database
    return users.map((user) => ({
      ...user,
      role: user.role as UserRole
    }))
  })
})
