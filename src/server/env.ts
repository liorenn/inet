import { z } from 'zod' // Importing zod library

// Define the schema for the environment variables
const envVariables = z.object({
  resendKey: z.string(), // Define resendKey as a string
  currencyApiUrl: z.string(), // Define currencyApiUrl as a string
  currencyApiKey: z.string() // Define currencyApiKey as a string
})

// Parse and validate the environment variables using the defined schema
export const env = envVariables.parse({
  resendKey: process.env.RESEND_KEY, // Parse and validate resend key from environment variables
  currencyApiUrl: process.env.CURRENCY_API_URL, // Parse and validate currency API URL from environment variables
  currencyApiKey: process.env.CURRENCY_API_KEY // Parse and validate currency API key from environment variables
})
