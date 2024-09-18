import { z } from 'zod' // Importing zod library

// Defining a schema for client environment variables using zod
const clientEnvVariables = z.object({
  websiteUrl: z.string(), // Schema for website URL as a string
  posthogToken: z.string(), // Schema for Posthog token as a string
  posthogApiHost: z.string() // Schema for Posthog API host as a string
})

// Parsing the environment variables using the defined schema
export const env = clientEnvVariables.parse({
  websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL, // Parsing website URL from environment variables
  posthogToken: process.env.NEXT_PUBLIC_POSTHOG_TOKEN, // Parsing Posthog token from environment variables
  posthogApiHost: process.env.NEXT_PUBLIC_POSTHOG_API_HOST // Parsing Posthog API host from environment variables
})
