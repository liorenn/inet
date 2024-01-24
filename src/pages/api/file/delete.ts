import { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { fileName } = req.body // Get fileName from request body

  if (!fileName || typeof fileName !== 'string') {
    // Check if fileName is a string
    return res.status(400).json({ error: 'Invalid fileName parameter' }) // Return error message
  }

  try {
    if (fs.existsSync(fileName)) {
      // Check if the file exists
      fs.unlinkSync(fileName) // Delete the file
      return res.status(200).json({ message: 'Image deleted successfully' }) // Return success message
    } else {
      // If the file doesn't exist
      return res.status(404).json({ error: 'File not found' }) // Return error message
    }
  } catch (error) {
    // Catch any errors
    return res.status(500).json({ error: 'Internal server error' }) // Return error message
  }
}
