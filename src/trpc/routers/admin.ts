import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Device, Prisma } from '@prisma/client'

export const AdminRouter = router({
  getDeviceColumns: publicProcedure.query(async ({ ctx }) => {
    //console.log(Prisma.dmmf.datamodel.models.map((model) => model.name))
    const tables = Prisma.dmmf.datamodel.models
    return tables
  }),
  getTableData: publicProcedure
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const query = `SELECT * FROM \"${input.tableName}\"`
      return await ctx.prisma.$queryRawUnsafe(query)
    }),
})

// enum tableNamesss {
//   'Camera',
//   'Color',
//   'User',
//   'Comment',
//   'DeviceUser',
//   'DeviceColor',
//   'Device',
//   'DeviceConnector',
//   'BiometricFeature',
//   'CameraType',
//   'DeviceType',
// }
