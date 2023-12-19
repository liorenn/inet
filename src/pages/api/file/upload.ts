import multer from 'multer'
import { NextApiRequest, NextApiResponse } from 'next'

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const upload = uploadProvider.single('file')
    upload(req as any, res as any, (err: any) => {
      if (err) {
        console.error(err)
        return res.status(500).end('File upload error')
      }
      const { originalname, path: filePath } = (req as any).file
      console.log('Uploaded file:', originalname, 'saved at:', filePath)
      res.status(200).json({ success: true })
    })
  } catch (error) {
    console.error(error)
    res.status(500).end('Internal Server Error')
  }
}

export default handler
