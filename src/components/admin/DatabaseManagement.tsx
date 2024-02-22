import { Button, Divider, SimpleGrid, Stack, Text, useMantineColorScheme } from '@mantine/core'

import { CreateNotification } from '@/utils/utils'
import { adminAccessKey } from 'config'
import { trpc } from '@/utils/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

// Defining breakpoints for the SimpleGrid component
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
  const { colorScheme } = useMantineColorScheme()
  const backupDatabaseMutation = trpc.auth.backupDatabase.useMutation() // The backup mutation
  const restoreDatabaseMutation = trpc.auth.restoreDatabase.useMutation() // The backup mutation

  // When access key changes
  useEffect(() => {
    // If the access key is less than the manager access key
    if (accessKey && accessKey < adminAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/') // Redirect to the home page
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
          variant={colorScheme === 'dark' ? 'filled' : 'light'}
          color={colorScheme === 'dark' ? 'dark' : 'gray'}
          size='xl'
          fullWidth
          disabled={backupDatabaseMutation.isLoading}
          onClick={() => {
            // backup the database
            backupDatabaseMutation.mutate(undefined, {
              // When the mutation is successful
              onSuccess() {
                CreateNotification(t('success'), 'green') // Create a success notification
              },
            })
          }}>
          {t('backupDatabase')}
        </Button>
        <Button
          variant={colorScheme === 'dark' ? 'filled' : 'light'}
          color={colorScheme === 'dark' ? 'dark' : 'gray'}
          size='xl'
          fullWidth
          disabled={restoreDatabaseMutation.isLoading}
          onClick={() => {
            // restore the database
            restoreDatabaseMutation.mutate(undefined, {
              // When the mutation is successful
              onSuccess() {
                CreateNotification(t('success'), 'green') // Create a success notification
              },
            })
          }}>
          {t('restoreDatabase')}
        </Button>
      </SimpleGrid>
    </Stack>
  )
}
