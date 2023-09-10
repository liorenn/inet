import type { Session } from '@supabase/auth-helpers-react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { trpc } from '../utils/trpc'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import Layout from '../components/layout/Layout'
import type { ColorScheme } from '@mantine/core'
import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { RouterTransition } from '../components/layout/RouterTransition'
import { createClient } from '@supabase/supabase-js'
import { Notifications } from '@mantine/notifications'
function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabase] = useState(() =>
    createClient(
      'https://dwbtkafawtzpzntudwnb.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnRrYWZhd3R6cHpudHVkd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM2MTc0MDksImV4cCI6MTk3OTE5MzQwOX0.84xKcgBpyzJbRVpQCEm3jASkMyame_hrrcxsLVkPaeo'
    )
  )
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
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
          loader: 'dots',
          colorScheme,
          breakpoints: {
            xs: '30em',
            sm: '48em',
            md: '64em',
            lg: '74em',
            xl: '90em',
          },
        }}>
        <Notifications />
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={pageProps.initialSession}>
          <Layout>
            <RouterTransition />
            <Component {...pageProps} />
          </Layout>
        </SessionContextProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default trpc.withTRPC(MyApp)
