import { NextApiRequest, NextApiResponse } from 'next'

import { User as DatabaseUser } from '@prisma/client'
import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { UserRole } from '~/src/models/schemas'
import { db } from '@/server/db'

export type User = Omit<DatabaseUser, 'id'>

const adapter = new PrismaAdapter(db.session, db.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production'
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      username: attributes.username,
      name: attributes.name,
      password: attributes.password,
      phone: attributes.phone,
      role: attributes.role
    }
  }
})

export async function validateRequest(req: NextApiRequest, res: NextApiResponse) {
  const sessionId = req.cookies[lucia.sessionCookieName]
  if (!sessionId) {
    return { user: null, session: null }
  }
  const { session, user } = await lucia.validateSession(sessionId)
  if (!session) {
    res.setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
    return { user: null, session: null }
  }
  if (session.fresh) {
    res.setHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
  }
  return { user, session }
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

type DatabaseUserAttributes = {
  email: string
  username: string
  name: string
  password: string
  phone: string
  role: UserRole
}
