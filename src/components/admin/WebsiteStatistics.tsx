import React, { useEffect } from 'react'

import { managerAccessKey } from 'config'
import { useMantineColorScheme } from '@mantine/core'
import { useRouter } from 'next/router'

type props = {
  accessKey: number // The user access key
}

export default function WebsiteStatistics({ accessKey }: props) {
  const router = useRouter() // Get the router
  const { colorScheme } = useMantineColorScheme() // Get the color scheme

  useEffect(() => {
    if (accessKey && accessKey < managerAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/') // If the access key is less than the manager access key redirect to the home page
    }
  }, [accessKey, router])

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.data.event === 'posthog:dimensions') {
        const iframe = document.getElementById('posthog-iframe') as HTMLIFrameElement
        if (iframe && e.source === iframe.contentWindow) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
          iframe.style.height = `${e.data.height}px` // Set the height of the iframe
        }
      }
    }
    window.addEventListener('message', handleMessage) // Listen for messages
    return () => {
      window.removeEventListener('message', handleMessage) // Remove the listener
    }
  }, [])

  return (
    <iframe
      id='posthog-iframe'
      title='PostHog Dashboard'
      width='100%'
      height='100%'
      frameBorder='0'
      className='dark:invert dark:grayscale-[50%]'
      style={{
        filter: colorScheme === 'dark' ? 'invert(93%) grayscale(5%)' : '',
      }}
      src='https://app.posthog.com/embedded/KJRt4aEDq1jeyaE_X4QvknNun_WZrw'></iframe>
  )
}
