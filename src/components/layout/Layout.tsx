import { Navbar } from './Navbar'
import type { ReactNode } from 'react'
import ScrollToTop from './ScrollToTop'
import useMount from '../../hooks/useMount'

const Layout = ({ children }: { children: ReactNode }) => {
  useMount()

  return (
    <>
      <Navbar />
      {children}
      <ScrollToTop />
    </>
  )
}

export default Layout
