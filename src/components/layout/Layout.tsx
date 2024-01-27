import Navbar from '@/components/layout/Navbar'
import type { ReactNode } from 'react'
import ScrollToTop from '@/components/layout/ScrollToTop'

// The component props
type Props = { children: ReactNode }

export default function layout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
      <ScrollToTop />
    </>
  )
}
