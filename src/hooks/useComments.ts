import { create } from 'zustand'

// Define the type for the comments state
type CommentsStats = {
  username: string // Define the username property
  ratingValue: number // Define the ratingValue property
  commentsAmount: number // Define the commentsAmount property
  setUsername: (value: string) => void // Define the setUsername setter function
  setRatingValue: (value: number) => void // Define the setRatingValue setter function
  setCommentsAmount: (value: number) => void // Define the setCommentsAmount setter function
}

// Create and export the custom hook for managing comments state
export const useComments = create<CommentsStats>()((set) => ({
  // Initialize the state variables
  username: '',
  commentsAmount: 0,
  ratingValue: 0,

  setUsername(value) {
    // Define the setter functions using the set function from Zustand
    set({ username: value }) // Set the username state
  },
  setCommentsAmount(value) {
    set({ commentsAmount: value }) // Set the commentsAmount state
  },
  setRatingValue(value) {
    set({ ratingValue: value }) // Set the ratingValue state
  },
}))
