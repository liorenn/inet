import { useEffect, useState } from 'react'

import { useMantineColorScheme } from '@mantine/core'
import { useRouter } from 'next/router'
import { useSiteSettings } from '@/hooks/useSiteSettings'

// The component props
type Props = {
  accessKey: number // The user access key
}

export default function WebsiteStatistics({ accessKey }: Props) {
  const router = useRouter() // Get the router
  const [height, setHeight] = useState(1200)
  const { colorScheme } = useMantineColorScheme() // Get the color scheme
  const {
    settings: { managerAccessKey },
  } = useSiteSettings()

  useEffect(() => {
    if (accessKey && accessKey < managerAccessKey) {
      router.push('/') // If the access key is less than the manager access key redirect to the home page
    }
  }, [accessKey, router])

  useEffect(() => {
    const onChange = (e: any) => {
      if (e.data.event === 'posthog:dimensions' && e.data.name === 'MyPostHogIframe') {
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
