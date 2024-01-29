import { Button, Divider, SimpleGrid, Stack, Text } from '@mantine/core'

import { CreateNotification } from '@/utils/utils'
import { adminAccessKey } from 'config'
import { trpc } from '@/utils/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

const breakpoints = [
  { minWidth: 300, cols: 1 },
  { minWidth: 500, cols: 2 },
]

// The component props
type Props = {
  accessKey: number // The user access key
}

export default function DatabaseManagement({ accessKey }: Props) {
  const router = useRouter() // Get the router
  const { t } = useTranslation('main') // Get the translation function
  const backupDatabaseMutation = trpc.auth.backupDatabase.useMutation() // The backup mutation
  const restoreDatabaseMutation = trpc.auth.restoreDatabase.useMutation() // The backup mutation

  useEffect(() => {
    if (accessKey && accessKey < adminAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/') // If the access key is less than the manager access key redirect to the home page
    }
  }, [accessKey, router])

  return (
    <Stack>
      <Text size={40} weight={600}>
        {t('databaseManagement')}
      </Text>
      <Divider />
      <SimpleGrid breakpoints={breakpoints} mb='lg'>
        <Button
          variant='filled'
          color='dark'
          size='xl'
          fullWidth
          disabled={backupDatabaseMutation.isLoading}
          onClick={() => {
            backupDatabaseMutation.mutate(undefined, {
              onSuccess() {
                CreateNotification(t('success'), 'green')
              },
            })
          }}>
          {t('backupDatabase')}
        </Button>
        <Button
          variant='filled'
          color='dark'
          size='xl'
          fullWidth
          disabled={restoreDatabaseMutation.isLoading}
          onClick={() => {
            restoreDatabaseMutation.mutate(undefined, {
              onSuccess() {
                CreateNotification(t('success'), 'green')
              },
            })
          }}>
          {t('restoreDatabase')}
        </Button>
      </SimpleGrid>
    </Stack>
  )
}
