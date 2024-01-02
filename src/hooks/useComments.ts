import { create } from 'zustand'

type CommentsStats = {
  username: string
  ratingValue: number
  commentsAmount: number
  setUsername: (value: string) => void
  setRatingValue: (value: number) => void
  setCommentsAmount: (value: number) => void
}

export const useComments = create<CommentsStats>()((set) => ({
  username: '',
  commentsAmount: 0,
  ratingValue: 0,
  setUsername(value) {
    set({ username: value })
  },
  setCommentsAmount(value) {
    set({ commentsAmount: value })
  },
  setRatingValue(value) {
    set({ ratingValue: value })
  },
}))
