import React, { useEffect } from 'react'
import { databaseEditorPort, managerAccessKey } from 'config'

import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'

type Props = {
  accessKey: number // The user access key
}

export default function DatabaseEditor({ accessKey }: Props) {
  const router = useRouter() // Get the router
  trpc.auth.openDatabaseEditor.useQuery() // Open the database editor
  const closeEditorMutation = trpc.auth.closeDatabaseEditor.useMutation() // Mutation to close the database editor

  useEffect(() => {
    return () => {
      // When the component unmounts
      closeEditorMutation.mutate() // Close the database editor
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (accessKey && accessKey < managerAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/') // If the access key is less than the manager access key redirect to the home page
    }
  }, [accessKey, router])

  return (
    <iframe
      title='Database Editor'
      width='100%'
      height='760px'
      frameBorder='0'
      src={`http://localhost:${databaseEditorPort}/`}></iframe>
  )
}
