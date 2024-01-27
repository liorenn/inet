import { Container, ScrollArea, SegmentedControl } from '@mantine/core'
import { adminAccessKey, defaultDashboard, managerAccessKey } from 'config'

import ConfigsEditor from '@/components/admin/ConfigsEditor'
import DatabaseEditor from '@/components/admin/DatabaseEditor'
import DatabaseViewer from '@/components/admin/DatabaseViewer'
import DeviceManagement from '@/components/admin/DeviceManagement'
import Head from 'next/head'
import Loader from '@/components/layout/Loader'
import UserManagement from '@/components/admin/UserManagement'
import WebsiteStatistics from '@/components/admin/WebsiteStatistics'
import { trpc } from '@/utils/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'
import { useViewportSize } from '@mantine/hooks'
import { z } from 'zod'

export default function Admin() {
  const user = useUser() // Get the user object from Supabase
  const router = useRouter()
  const { width } = useViewportSize() // Get the width of the viewport
  const { t } = useTranslation('translations')
  const button = z.string().parse(router.query.dashboard ?? '')
  const accessKeyQuery = trpc.auth.getAccessKey.useQuery({
    email: user?.email,
  })
  const accessKey = accessKeyQuery.data

  useEffect(() => {
    if (!router.query.dashboard) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`?dashboard=${defaultDashboard}`)
    }
  }, [router])

  useEffect(() => {
    if (accessKey && accessKey < adminAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/')
    }
  }, [accessKey, router])

  const buttons =
    accessKey && accessKey < managerAccessKey
      ? [{ value: 'deviceManagement', label: t('deviceManagement') }]
      : [
          { value: 'deviceManagement', label: t('deviceManagement') },
          { value: 'userManagement', label: t('userManagement') },
          { value: 'websiteStatistics', label: t('websiteStatistics') },
          { value: 'configsEditor', label: t('configsEditor') },
          { value: 'databaseViewer', label: t('databaseViewer') },
          { value: 'databaseEditor', label: t('databaseEditor') },
        ]

  return (
    <>
      <Head>
        <title>{buttons.find((b) => b.value === button)?.label ?? t('deviceManagement')}</title>
      </Head>
      {accessKey ? (
        <Container size='xl'>
          <ScrollArea mb='md' type={width < 400 ? 'always' : 'auto'}>
            <SegmentedControl
              data={buttons}
              onChange={(value: string) => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                router.push(`?dashboard=${value}`)
              }}
              value={button}
              fullWidth
              size='md'
              radius='md'
              mb='sm'
            />
          </ScrollArea>
          {button === 'databaseViewer' && accessKey >= managerAccessKey && (
            <DatabaseViewer accessKey={accessKey} />
          )}
          {button === 'deviceManagement' && accessKey >= adminAccessKey && (
            <DeviceManagement accessKey={accessKey} />
          )}
          {button === 'userManagement' && accessKey >= managerAccessKey && (
            <UserManagement accessKey={accessKey} />
          )}
          {button === 'websiteStatistics' && accessKey >= managerAccessKey && (
            <WebsiteStatistics accessKey={accessKey} />
          )}
          {button === 'configsEditor' && accessKey >= managerAccessKey && (
            <ConfigsEditor accessKey={accessKey} />
          )}
          {button === 'databaseEditor' && accessKey >= managerAccessKey && (
            <DatabaseEditor accessKey={accessKey} />
          )}
        </Container>
      ) : (
        <Loader />
      )}
    </>
  )
}
