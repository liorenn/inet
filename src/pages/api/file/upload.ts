import { NextApiRequest, NextApiResponse } from 'next'

import multer from 'multer'

export const config = {
  // Set config
  api: {
    bodyParser: false,
  },
}

const uploadProvider = multer({
  // Create multer upload provider
  storage: multer.diskStorage({
    destination: 'public/users', // Set destination folder
    filename(_req, file, callback) {
      callback(null, file.originalname)
    },
  }),
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const upload = uploadProvider.single('file') // Get upload function
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    upload(req as any, res as any, (err: any) => {
      // Call upload function
      if (err) {
        // Check if error
        return res.status(500).end('File upload error') // Return error
      }
      return res.status(200).json({ success: true }) // Return success
    })
  } catch (error) {
    res.status(500).end('Internal Server Error') // Return error
  }
}
