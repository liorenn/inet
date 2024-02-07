import { NavigationProgress, startNavigationProgress } from '@mantine/nprogress'

import { completeNavigationProgress } from '@mantine/nprogress'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function RouterTransition() {
  const router = useRouter() // Get the router

  // When route changes
  useEffect(() => {
    // The start navigation progress function
    const handleStart = (url: string) => url !== router.asPath && startNavigationProgress()
    const handleComplete = () => completeNavigationProgress() // The complete navigation progress function

    router.events.on('routeChangeStart', handleStart) // Activate the start navigation progress function when route changes starts
    router.events.on('routeChangeComplete', handleComplete) // Activate the complete navigation progress function when route changes completes
    router.events.on('routeChangeError', handleComplete) // Activate the complete navigation progress function when route changes errors

    // When user leaves the page
    return () => {
      router.events.off('routeChangeStart', handleStart) // Deactivate the start navigation progress function when user leaves the page
      router.events.off('routeChangeComplete', handleComplete) // Deactivate the complete navigation progress function when user leaves the page
      router.events.off('routeChangeError', handleComplete) // Deactivate the complete navigation progress function when user leaves the page
    }
  }, [router.asPath, router.events])

  return router.pathname.includes('compare') || router.pathname.includes('find') ? (
    <></>
  ) : (
    <NavigationProgress autoReset={true} size={4} />
  )
}
