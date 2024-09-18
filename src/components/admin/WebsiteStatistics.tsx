import { useEffect, useState } from 'react'

import { useMantineColorScheme } from '@mantine/core'

export default function WebsiteStatistics() {
  const [height, setHeight] = useState(1200)
  const { colorScheme } = useMantineColorScheme() // Get the color scheme

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
        filter: colorScheme === 'dark' ? 'invert(93%) grayscale(5%)' : ''
      }}
      src='https://app.posthog.com/embedded/KJRt4aEDq1jeyaE_X4QvknNun_WZrw'></iframe>
  )
}
