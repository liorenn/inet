import { Container, ScrollArea, SegmentedControl } from '@mantine/core'
import { useEffect, useState } from 'react'
import DatabaseViewer from '../../components/admin/DatabaseViewer'
import DeviceManagement from '../../components/admin/DeviceManagement'
import UserManagement from '../../components/admin/UserManagement'
import { trpc } from '../../misc/trpc'
import { useRouter } from 'next/router'
import Loader from '../../components/layout/Loader'
import { adminAccessKey, managerAccessKey } from '../../../config'
import { useUser } from '@supabase/auth-helpers-react'
import useTranslation from 'next-translate/useTranslation'
import WebsiteStatistics from '../../components/admin/WebsiteStatistics'

export default function Admin() {
  const user = useUser()
  const router = useRouter()
  const { t } = useTranslation('translations')
  const [button, setButton] = useState('')
  const { data: accessKey } = trpc.auth.getAccessKey.useQuery({
    email: user?.email,
  })
  const buttons =
    accessKey && accessKey < managerAccessKey
      ? [{ value: 'deviceManagement', label: t('deviceManagement') }]
      : [
          { value: 'databaseViewer', label: t('databaseViewer') },
          { value: 'deviceManagement', label: t('deviceManagement') },
          { value: 'userManagement', label: t('userManagement') },
          { value: 'websiteStatistics', label: t('websiteStatistics') },
        ]

  useEffect(() => {
    if (accessKey && accessKey < adminAccessKey) {
      router.push('/')
    }
    if (accessKey && accessKey >= managerAccessKey) {
    }
  }, [accessKey])

  return (
    <>
      {accessKey ? (
        <Container size='xl'>
          <ScrollArea>
            <SegmentedControl
              data={buttons}
              onChange={setButton}
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
        </Container>
      ) : (
        <Loader />
      )}
    </>
  )
}
