import { NextApiRequest, NextApiResponse } from 'next'
import { existsSync, unlinkSync } from 'fs'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileName } = req.body // Get the file name from request body

  // If file name does not exists or isnt a string
  if (!fileName || typeof fileName !== 'string') {
    return res.status(400).json({ error: 'Invalid fileName parameter' }) // Return error message
  }

  try {
    // Check if the file exists
    if (existsSync(fileName)) {
      unlinkSync(fileName) // Delete the file
      return res.status(200).json({ message: 'Image deleted successfully' }) // Return success message
    } // If the file doesn't exist
    else {
      return res.status(404).json({ error: 'File not found' }) // Return error message
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' }) // Return error message if an error occurs
  }
}
