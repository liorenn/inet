import type { Session } from '@supabase/auth-helpers-react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { trpc } from '../misc/trpc'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import type { ColorScheme } from '@mantine/core'
import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { RouterTransition } from '../components/layout/RouterTransition'
import { Notifications } from '@mantine/notifications'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import {
  customBreakPoints,
  defaultColorSchema,
  posthogApiHost,
  posthogDebug,
  posthogToken,
} from '../../config'
import { supabase } from '../server/supabase'

if (typeof window !== 'undefined') {
  posthog.init(posthogToken, {
    api_host: posthogApiHost,
    loaded: (posthog) => {
      posthog.debug(posthogDebug)
    },
  })
}

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: defaultColorSchema,
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          breakpoints: customBreakPoints,
        }}>
        <Notifications />
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
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default trpc.withTRPC(MyApp)
