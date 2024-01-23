import { z } from 'zod'

const clientEnvVariables = z.object({
  websiteUrl: z.string(),
  supabaseUrl: z.string(),
  supabaseAnonKey: z.string(),
  posthogToken: z.string(),
  posthogApiHost: z.string(),
})

export const clientEnv = clientEnvVariables.parse({
  websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  posthogToken: process.env.NEXT_PUBLIC_POSTHOG_TOKEN,
  posthogApiHost: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
})
