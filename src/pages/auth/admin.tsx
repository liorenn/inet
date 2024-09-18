import { Container, ScrollArea, SegmentedControl } from '@mantine/core'

import DatabaseViewer from '@/components/admin/DatabaseViewer'
import DeviceManagement from '@/components/admin/DeviceManagement'
import Head from 'next/head'
import Loader from '@/components/layout/Loader'
import SiteSettingsEditor from '@/components/admin/SiteSettingsEditor'
import UserManagement from '@/components/admin/UserManagement'
import WebsiteStatistics from '@/components/admin/WebsiteStatistics'
import { api } from '@/lib/trpc'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'
import { z } from 'zod'

export default function Admin() {
  const router = useRouter()
  const { width } = useViewportSize() // Get the width of the viewport
  const { t } = useTranslation('main')
  const button = z.string().parse(router.query.dashboard ?? '') // Get the dashboard from the url
  const { data: user } = api.auth.getUser.useQuery() // Get the user

  // Define the buttons that will be displayed according to the user access key
  const buttons =
    user && user.role === 'admin' // If the use is an admin
      ? [{ value: 'deviceManagement', label: t('deviceManagement') }]
      : // If the user is a manager
        [
          { value: 'deviceManagement', label: t('deviceManagement') },
          { value: 'userManagement', label: t('userManagement') },
          { value: 'websiteStatistics', label: t('websiteStatistics') },
          { value: 'siteSettingsEditor', label: t('siteSettingsEditor') },
          { value: 'databaseViewer', label: t('databaseViewer') }
        ]

  return (
    <>
      <Head>
        <title>{buttons.find((b) => b.value === button)?.label ?? t('deviceManagement')}</title>
      </Head>
      {user ? (
        <Container size='xl'>
          <ScrollArea offsetScrollbars mb='md' type={width < 400 ? 'always' : 'auto'}>
            <SegmentedControl
              data={buttons}
              onChange={(value: string) => {
                if (value === 'databaseEditor') {
                  window.open('http://localhost:5555/', '_blank')?.focus()
                } else {
                  router.push(`?dashboard=${value}`)
                }
              }}
              value={button}
              fullWidth
              size='md'
              radius='md'
              mb='sm'
            />
          </ScrollArea>
          {button === 'databaseViewer' && user.role === 'manager' && <DatabaseViewer />}
          {button === 'deviceManagement' && (user.role === 'admin' || user.role === 'manager') && (
            <DeviceManagement />
          )}
          {button === 'userManagement' && user.role === 'manager' && <UserManagement />}
          {button === 'websiteStatistics' && user.role === 'manager' && <WebsiteStatistics />}
          {button === 'siteSettingsEditor' && user.role === 'manager' && <SiteSettingsEditor />}
        </Container>
      ) : (
        <Loader />
      )}
    </>
  )
}
