import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Prisma } from '@prisma/client'

export const AdminRouter = router({
  getDeviceColumns: publicProcedure.query(async ({ ctx }) => {
    return Prisma.dmmf.datamodel.models
  }),
})
