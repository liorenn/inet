import Navbar from '@/components/layout/Navbar'
import type { ReactNode } from 'react'
import ScrollToTop from '@/components/layout/ScrollToTop'

type props = { children: ReactNode }

export default function layout({ children }: props) {
  return (
    <>
      <Navbar />
      {children}
      <ScrollToTop />
    </>
  )
}
