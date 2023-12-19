import { create } from 'zustand'

type CommentsStats = {
  username: string
  ratingValue: number
  commentsAmout: number
  setUsername: (value: string) => void
  setRatingValue: (value: number) => void
  setCommentsAmout: (value: number) => void
}

export const useComments = create<CommentsStats>()((set) => ({
  username: '',
  commentsAmout: 0,
  ratingValue: 0,
  setUsername(value) {
    set({ username: value })
  },
  setCommentsAmout(value) {
    set({ commentsAmout: value })
  },
  setRatingValue(value) {
    set({ ratingValue: value })
  },
}))
