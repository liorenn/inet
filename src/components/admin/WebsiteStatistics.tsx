import { useEffect, useState } from 'react'

import { managerAccessKey } from 'config'
import { useMantineColorScheme } from '@mantine/core'
import { useRouter } from 'next/router'

// The component props
type Props = {
  accessKey: number // The user access key
}

export default function WebsiteStatistics({ accessKey }: Props) {
  const router = useRouter() // Get the router
  const [height, setHeight] = useState(1200)
  const { colorScheme } = useMantineColorScheme() // Get the color scheme

  useEffect(() => {
    if (accessKey && accessKey < managerAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/') // If the access key is less than the manager access key redirect to the home page
    }
  }, [accessKey, router])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onChange = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.data.event === 'posthog:dimensions' && e.data.name === 'MyPostHogIframe') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setHeight(e.data.height)
      }
    }
    window.addEventListener('message', onChange)
    return () => window.removeEventListener('message', onChange)
  }, [])

  return (
    <iframe
      id='posthog-iframe'
      title='PostHog Dashboard'
      width='100%'
      height={height}
      frameBorder='0'
      style={{
        filter: colorScheme === 'dark' ? 'invert(93%) grayscale(5%)' : '',
      }}
      src='https://app.posthog.com/embedded/KJRt4aEDq1jeyaE_X4QvknNun_WZrw'></iframe>
  )
}
