import { Container, MantineSize } from '@mantine/core'

import Head from 'next/head'

type Props = {
  children?: React.ReactNode
  title?: string
  container?: number | MantineSize
}

export default function Page({ children, title = 'Page', container = 'md' }: Props) {
  return (
    <Container p={0} size={container}>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </Container>
  )
}
