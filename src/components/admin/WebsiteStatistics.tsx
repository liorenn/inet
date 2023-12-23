import { useMantineColorScheme } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { managerAccessKey } from '../../../config'

export default function WebsiteStatistics({
  accessKey,
}: {
  accessKey: number
}) {
  const router = useRouter()
  const { colorScheme } = useMantineColorScheme()

  useEffect(() => {
    if (accessKey && accessKey < managerAccessKey) {
      router.push('/')
    }
  }, [accessKey])

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.event === 'posthog:dimensions') {
        const iframe = document.getElementById(
          'posthog-iframe'
        ) as HTMLIFrameElement
        if (iframe && e.source === iframe.contentWindow) {
          iframe.style.height = `${e.data.height}px`
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
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
        filter: colorScheme === 'dark' ? 'invert(89%) grayscale(5%)' : '',
      }}
      src='https://app.posthog.com/embedded/KJRt4aEDq1jeyaE_X4QvknNun_WZrw'></iframe>
  )
}
