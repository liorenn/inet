import { NextApiRequest, NextApiResponse } from 'next'

import multer from 'multer'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadProvider = multer({
  storage: multer.diskStorage({
    destination: 'public/users',
    filename(_req, file, callback) {
      callback(null, file.originalname)
    },
  }),
})

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const upload = uploadProvider.single('file')
    upload(req as any, res as any, (err: any) => {
      if (err) {
        console.error(err)
        return res.status(500).end('File upload error')
      }
      return res.status(200).json({ success: true })
    })
  } catch (error) {
    console.error(error)
    res.status(500).end('Internal Server Error')
  }
}

export default handler
