import { NextApiRequest, NextApiResponse } from 'next'

import multer from 'multer'

export const config = {
  // Set config
  api: {
    bodyParser: false,
  },
}

// Create multer upload provider
const uploadProvider = multer({
  storage: multer.diskStorage({
    destination: 'public/users', // Set destination folder
    // Set a callback function
    filename(_req, file, callback) {
      callback(null, file.originalname)
    },
  }),
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const upload = uploadProvider.single('file') // Get upload function
    // Call upload function
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    upload(req as any, res as any, (err: any) => {
      // Check if error
      if (err) {
        return res.status(500).end('File upload error') // Return error
      }
      return res.status(200).json({ success: true }) // Return success
    })
  } catch (error) {
    return res.status(500).end('Internal Server Error') // Return error
  }
}
