import { ColorSchemeProvider, MantineProvider, createEmotionCache } from '@mantine/core'
import { defaultColorSchema, posthogApiHost, posthogDebug, posthogToken } from 'config'

import type { AppProps } from 'next/app'
import type { ColorScheme } from '@mantine/core'
import Layout from '@/components/layout/Layout'
import { Notifications } from '@mantine/notifications'
import { PostHogProvider } from 'posthog-js/react'
import RouterTransition from '@/components/layout/RouterTransition'
import type { Session } from '@supabase/auth-helpers-react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { SpotlightControl } from '@/components/misc/Spotlight'
import posthog from 'posthog-js'
import rtlPlugin from 'stylis-plugin-rtl'
import { supabase } from '@/server/client'
import { trpc } from '@/server/client'
import { useEffect } from 'react'
import { useLocalStorage } from '@mantine/hooks'
import useTranslation from 'next-translate/useTranslation'

if (typeof window !== 'undefined') {
  posthog.init(posthogToken, {
    api_host: posthogApiHost,
    loaded: (posthog) => {
      posthog.debug(posthogDebug)
    },
  })
}

type props = AppProps<{
  initialSession: Session
}>

const rtlCache = createEmotionCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
})

function MyApp({ Component, pageProps }: props) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: defaultColorSchema,
    getInitialValueInEffect: true,
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
  const { lang } = useTranslation('translations')

  useEffect(() => {
    document.body.dir = lang === 'he' ? 'rtl' : 'ltr'
  }, [lang])

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={lang === 'he' ? rtlCache : undefined}
        theme={{
          colorScheme,
          dir: lang === 'he' ? 'rtl' : 'ltr',
          breakpoints: {
            xs: '30em',
            sm: '48em',
            md: '64em',
            lg: '74em',
            xl: '90em',
          },
        }}>
        <Notifications />
        <SpotlightControl>
          <PostHogProvider client={posthog}>
            <SessionContextProvider
              supabaseClient={supabase}
              initialSession={pageProps.initialSession}>
              <Layout>
                <RouterTransition />
                <Component {...pageProps} />
              </Layout>
            </SessionContextProvider>
          </PostHogProvider>
        </SpotlightControl>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default trpc.withTRPC(MyApp)
