import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Prisma } from '@prisma/client'
import soapRequest from 'easy-soap-request'
import { XMLParser } from 'fast-xml-parser'

export const AdminRouter = router({
  getSoap: publicProcedure.query(async ({ ctx }) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const url = 'https://localhost:44394/Asp/WebService1.asmx'
    const xml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
       <tem:UserExists>
          <tem:username>lioren</tem:username>
       </tem:UserExists>
    </soapenv:Body>
 </soapenv:Envelope>
    `
    const Headers = {
      'Content-Type': 'text/xml;charset=UTF-8',
    }

    const { response } = await soapRequest({
      url,
      xml,
      headers: Headers,
    })
    const { body } = response
    const parser = new XMLParser()
    let json = parser.parse(body)
    const userExistsResult =
      json['soap:Envelope']['soap:Body']['UserExistsResponse'][
        'UserExistsResult'
      ]
    return userExistsResult
  }),
  getUserColumns: publicProcedure.query(async ({ ctx }) => {
    return Prisma.dmmf.datamodel.models.find((model) => model.name === 'User')
  }),
  getTablesColumns: publicProcedure.query(async ({ ctx }) => {
    return Prisma.dmmf.datamodel.models
  }),
  getUsersData: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.prisma.user.findMany()
  }),
  getTableData: publicProcedure
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const query = `SELECT * FROM \"${input.tableName}\"`
      return await ctx.prisma.$queryRawUnsafe(query)
    }),
  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase.auth.admin.deleteUser(input.id)
      await ctx.prisma.user.delete({
        where: { id: input.id },
      })
    }),
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        username: z.string(),
        password: z.string(),
        accessKey: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(typeof input.accessKey)
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      })
    }),
})

/*
    const xmlData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
       <tem:Add>
          <tem:n1>6</tem:n1>
          <tem:n2>4</tem:n2>
       </tem:Add>
    </soapenv:Body>
 </soapenv:Envelope>`

    const config = {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
    axios
      .post(url, xmlData, config)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
   
*/

/*
  const soapRequest = require('easy-soap-request')
    const sampleHeaders = {
      'Content-Type': 'text/xml;charset=UTF-8',
    }
    const xml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:Add>
         <tem:n1>5</tem:n1>
         <tem:n2>3</tem:n2>
      </tem:Add>
   </soapenv:Body>
</soapenv:Envelope>
    `
    ;(async () => {
      const { response } = await soapRequest({
        url: url,
        headers: sampleHeaders,
        xml: xml,
        timeout: 1000,
      }) // Optional timeout parameter(milliseconds)
      const { body, statusCode } = response
      console.log(body)
    })()
*/

/*
    const client = require('soap-client-node')

    const urls = {
      url: 'https://localhost:44394/Asp/WebService1.asmx?WSDL',
      xmlns: 'http://tempuri.org/',
    }

    const methodParams = {
      type: 'POST',
      method: 'Add',
    }

    const params = {
      n1: 5,
      n2: 3,
    }

    client.createClient(
      urls,
      methodParams,
      params,
      function (err: any, result: any) {
        if (err) {
          console.log(err)
        } else {
          console.log(JSON.stringify(result))
        }
      }
    )
    return null
*/
