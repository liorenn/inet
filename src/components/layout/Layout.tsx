import Navbar from './Navbar'
import { ReactNode } from 'react'
import ScrollToTop from './ScrollToTop'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
      <ScrollToTop />
    </>
  )
}

export default Layout
