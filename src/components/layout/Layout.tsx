import Navbar from './Navbar'
import type { ReactNode } from 'react'
import ScrollToTop from './ScrollToTop'

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
