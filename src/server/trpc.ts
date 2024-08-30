import { initTRPC } from '@trpc/server' // Importing the initTRPC function from the trpc server
import superjson from 'superjson' // Importing the superjson library
import { type inferAsyncReturnType } from '@trpc/server'
import { prisma } from '@/server/client'

// Create a function that creates the context based on the provided Next.js context options
export const createContext = () => {
  return { prisma }
}

// Define a type for the context based on the createContext function
type Context = inferAsyncReturnType<typeof createContext>

// Creating a TRPC context with the specified transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router // Create the router from the TRPC context
export const method = t.procedure // Create the method from the TRPC context
