import { Navbar } from './Navbar'
import type { ReactNode } from 'react'
import ScrollToTop from './ScrollToTop'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <ScrollToTop />
    </>
  )
}

export default Layout
