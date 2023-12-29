import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { fileName } = req.body
  console.log(fileName)
  if (!fileName || typeof fileName !== 'string') {
    return res.status(400).json({ error: 'Invalid fileName parameter' })
  }
  try {
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName)
      return res.status(200).json({ message: 'Image deleted successfully' })
    } else {
      return res.status(404).json({ error: 'File not found' })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
