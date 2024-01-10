import Navbar from '@/components/layout/Navbar'
import type { ReactNode } from 'react'
import ScrollToTop from '@/components/layout/ScrollToTop'

type props = { children: ReactNode }

const Layout = ({ children }: props) => {
  return (
    <>
      <Navbar />
      {children}
      <ScrollToTop />
    </>
  )
}

export default Layout
