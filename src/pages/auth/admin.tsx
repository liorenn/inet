import { Container, ScrollArea, SegmentedControl } from '@mantine/core'
import { adminAccessKey, defaultDashboard, managerAccessKey } from 'config'

import ConfigsEditor from '@/components/admin/ConfigsEditor'
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
import { z } from 'zod'

export default function Admin() {
  const user = useUser()
  const router = useRouter()
  const { t } = useTranslation('translations')
  const button = z.string().parse(router.query.dashboard ?? '')
  const { data: accessKey } = trpc.auth.getAccessKey.useQuery({
    email: user?.email,
  })

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
          { value: 'databaseViewer', label: t('databaseViewer') },
          { value: 'deviceManagement', label: t('deviceManagement') },
          { value: 'userManagement', label: t('userManagement') },
          { value: 'websiteStatistics', label: t('websiteStatistics') },
          { value: 'configsEditor', label: t('configsEditor') },
        ]

  return (
    <>
      <Head>
        <title>{buttons.find((b) => b.value === button)?.label ?? t('deviceManagement')}</title>
      </Head>
      {accessKey ? (
        <Container size='xl'>
          <ScrollArea>
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
              mb='lg'
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
        </Container>
      ) : (
        <Loader />
      )}
    </>
  )
}
