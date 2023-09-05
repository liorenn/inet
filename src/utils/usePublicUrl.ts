import { create } from 'zustand'

interface PublicUrl {
  publicUrl: string
  change: (newPublicUrl: string) => void
}

const usePublicUrl = create<PublicUrl>()((set) => ({
  publicUrl: '',
  change: (newPublicUrl) => set(() => ({ publicUrl: newPublicUrl })),
}))

export default usePublicUrl
