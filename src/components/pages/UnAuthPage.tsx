import { MantineSize } from '@mantine/core'
import Page from '@/components/pages/Page'
import { api } from '@/lib/trpc'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

type Props = {
  children?: React.ReactNode
  title?: string
  container?: number | MantineSize
}

export default function UnAuthPage({ children, title = 'Page', container = 'md' }: Props) {
  const router = useRouter()
  const { data, isLoading } = api.auth.getUser.useQuery()

  useEffect(() => {
    if (!isLoading && data) {
      router.replace('/')
    }
  }, [isLoading, data])

  return (
    <Page title={title} container={container}>
      {!isLoading && !data ? children : null}
    </Page>
  )
}
