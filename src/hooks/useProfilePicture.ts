import { create } from 'zustand'

type imageInfo = {
  imageExists: boolean // Define the imageExists property
  imagePath: string // Define the imagePath property
  setImageExists: (imageExists: boolean) => void // Define the setImageExists function
  setImagePath: (imagePath: string) => void // Define the setImagePath function
}

// Create and export the custom hook for managing the selected Profile Picture state
export const useProfilePicture = create<imageInfo>()((set) => ({
  imageExists: false, // Set the default value of imageExists to false
  imagePath: '', // Set the default value of imagePath to an empty string
  setImageExists(imageExists) {
    // Define the setImageExists function
    set(() => ({ imageExists })) // Set the imageExists state
  },
  setImagePath(imagePath) {
    // Define the setImagePath function
    set(() => ({ imagePath })) // Set the imagePath state
  },
}))
