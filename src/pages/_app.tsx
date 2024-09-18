import { ColorSchemeProvider, MantineProvider, createEmotionCache } from '@mantine/core'

import type { AppProps } from 'next/app'
import type { ColorScheme } from '@mantine/core'
import Layout from '@/components/layout/Layout'
import { Notifications } from '@mantine/notifications'
import { PostHogProvider } from 'posthog-js/react'
import RouterTransition from '@/components/layout/RouterTransition'
import SpotlightControl from '@/components/misc/Spotlight'
import { api } from '@/lib/trpc'
import { env } from '~/src/lib/clientEnv'
import posthog from 'posthog-js'
import rtlPlugin from 'stylis-plugin-rtl'
import { useEffect } from 'react'
import { useLocalStorage } from '@mantine/hooks'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import useTranslation from 'next-translate/useTranslation'

// If there is a window
if (typeof window !== 'undefined') {
  // Initialize PostHog client
  posthog.init(env.posthogToken, {
    api_host: env.posthogApiHost,
    loaded: (posthog) => {
      posthog.debug(false)
    }
  })
}

// Create rtl cache
const rtlCache = createEmotionCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin]
})

function App({ Component, pageProps }: AppProps) {
  const { lang } = useTranslation('main') // Get the current language
  const {
    settings: { defaultColorScheme, rtlInHebrew }
  } = useSiteSettings()

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'colorScheme',
    defaultValue: defaultColorScheme as ColorScheme,
    getInitialValueInEffect: true
  }) // Get the color scheme
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark')) // Toggle the color scheme function

  // When the language changes
  useEffect(() => {
    // Set the direction of the document based on the language
    document.body.dir = rtlInHebrew ? (lang === 'he' ? 'rtl' : 'ltr') : 'ltr'
  }, [lang])

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={rtlInHebrew ? (lang === 'he' ? rtlCache : undefined) : undefined}
        theme={{
          colorScheme,
          dir: rtlInHebrew ? (lang === 'he' ? 'rtl' : 'ltr') : 'ltr',
          breakpoints: {
            xs: '30em',
            sm: '48em',
            md: '64em',
            lg: '74em',
            xl: '90em'
          }
        }}>
        <Notifications />
        <SpotlightControl>
          <PostHogProvider client={posthog}>
            <Layout>
              <RouterTransition />
              <Component {...pageProps} />
            </Layout>
          </PostHogProvider>
        </SpotlightControl>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default api.withTRPC(App)
