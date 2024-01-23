import { z } from 'zod'

const envVariables = z.object({
  soapServerUrl: z.string(),
  resendKey: z.string(),
  currencyApiUrl: z.string(),
  currencyApiKey: z.string(),
  websiteStatus: z.enum(['development', 'test', 'production']),
})

export const env = envVariables.parse({
  soapServerUrl: process.env.SOAP_SERVER_URL,
  resendKey: process.env.RESEND_KEY,
  currencyApiUrl: process.env.CURRENCY_API_URL,
  currencyApiKey: process.env.CURRENCY_API_KEY,
  websiteStatus: process.env.WEBSITE_STATUS,
})
