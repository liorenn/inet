import { Container, ScrollArea, SegmentedControl } from '@mantine/core'
import { adminAccessKey, defaultDashboard, managerAccessKey } from 'config'

import ConfigsEditor from '@/components/admin/ConfigsEditor'
import DatabaseEditor from '@/components/admin/DatabaseEditor'
import DatabaseManagement from '@/components/admin/DatabaseManagement'
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
  const openEditorMutation = trpc.auth.openDatabaseEditor.useMutation() // Open the database editor
  const button = z.string().parse(router.query.dashboard ?? '') // Get the dashboard from the url
  const closeEditorMutation = trpc.auth.closeDatabaseEditor.useMutation() // Mutation to close the database editor
  const accessKeyQuery = trpc.auth.getAccessKey.useQuery({
    email: user?.email,
  }) // The access key query
  const accessKey = accessKeyQuery.data // The access key

  // When the url changes
  useEffect(() => {
    // If the dashboard is undefined
    if (!router.query.dashboard) {
      openEditorMutation.mutate() // Open the database editor
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`?dashboard=${defaultDashboard}`) // Set the dashboard to the default dashboard
    }
    // If the dashboard is the Database Editor
    else if (router.query.dashboard === 'databaseEditor') {
      openEditorMutation.mutate() // Open the database editor
    }
    // If the dashboard is not the Database Editor
    else {
      closeEditorMutation.mutate() // Close the database editor
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  // When the access key changes
  useEffect(() => {
    // If the access key is smaller than the admin access key
    if (accessKey && accessKey < adminAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/') // Redirect to the home page
    }
  }, [accessKey, router])

  // Define the buttons that will be displayed according to the user access key
  const buttons =
    accessKey && accessKey < managerAccessKey // If the use is an admin
      ? [
          { value: 'deviceManagement', label: t('deviceManagement') },
          { value: 'databaseManagement', label: t('databaseManagement') },
        ]
      : // If the user is a manager
        [
          { value: 'deviceManagement', label: t('deviceManagement') },
          { value: 'userManagement', label: t('userManagement') },
          { value: 'databaseManagement', label: t('databaseManagement') },
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
          {button === 'databaseManagement' && accessKey >= adminAccessKey && (
            <DatabaseManagement accessKey={accessKey} />
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
