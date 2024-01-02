import { create } from 'zustand'

type imageInfo = {
  imageExists: boolean
  imagePath: string
  setImageExists: (imageExists: boolean) => void
  setImagePath: (imagePath: string) => void
}

export const useProfilePicture = create<imageInfo>()((set) => ({
  imageExists: false,
  imagePath: '',
  setImageExists(imageExists) {
    set(() => ({ imageExists }))
  },
  setImagePath(imagePath) {
    set(() => ({ imagePath }))
  },
}))
