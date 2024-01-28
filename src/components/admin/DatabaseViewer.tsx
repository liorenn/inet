import { Center, Container, ScrollArea, SegmentedControl, Table } from '@mantine/core'
import { useSession, useUser } from '@supabase/auth-helpers-react'

import Loader from '@/components/layout/Loader'
import { managerAccessKey } from 'config'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'

// The component props
type Props = {
  accessKey: number
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
function findObjectByPropertyValue<T>(array: T[], name: keyof T, value: T[keyof T]) {
  return array.find((item) => item[name] === value)
}

export default function DatabaseViewer({ accessKey }: Props) {
  const user = useUser() // Get the user object from Supabase
  const router = useRouter() // Get the router object from Next.js
  const session = useSession() // Get the session object from Supabase
  const { width } = useViewportSize()
  const { t } = useTranslation('translations') // Get the translation function from Next.js
  const [table, setTable] = useState('') // State variable to store the selected table
  const [loading, setLoading] = useState(false) // State variable to store the loading state
  const tablesPropertiesQuery = trpc.auth.getTablesProperties.useQuery() // Query to get the properties of the tables
  const getTableDataMutation = trpc.auth.getTableData.useMutation() // Mutation to get the data of the selected table
  const [tableData, setTableData] = useState<string[][]>([]) // State variable to store the data of the selected table

  if (accessKey < managerAccessKey) {
    // If the access key is less than the manager access key
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/') // Redirect to the home page
  }

  function changeTableName(tableName: string) {
    setLoading(true) // Set the loading state to true
    setTable(tableName) // Set the selected table
    getTableDataMutation.mutate(
      // Get the data of the selected table
      { tableName: tableName },
      {
        onSuccess(unknownData) {
          const data = unknownData as any
          const stringArrays: string[][] = data.map((obj: any) =>
            // Convert the unknown data to an array of objects
            Object.values(obj).map((val) => {
              if (val instanceof Date) {
                return val.toLocaleDateString('en-us', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              }
              return String(val)
            })
          )
          setTableData(stringArrays) // Set the data of the selected table
          setLoading(false) // Set the loading state to false
        },
      }
    )
  }

  if (!(user && session)) {
    // If the user or session is not available
    return <Center>{t('accessDeniedMessageSignIn')}</Center>
  }

  if (!(tablesPropertiesQuery.data && tableData)) {
    // If the tables names or data is not loaded
    return <Loader />
  }

  return (
    <>
      <Container size='xl'>
        <ScrollArea mb='lg' type={width < 400 ? 'always' : 'auto'}>
          <SegmentedControl
            data={tablesPropertiesQuery.data.map((value) => value.name)}
            onChange={(tableName) => changeTableName(tableName)}
            value={table}
            fullWidth
            size='md'
            radius='md'
            mb='sm'
          />
        </ScrollArea>
        <ScrollArea type={width < 400 ? 'always' : 'auto'}>
          {tableData.length > 0 && !loading ? ( // If there is data and the data finished loading
            <Table striped highlightOnHover withBorder withColumnBorders>
              <thead>
                <tr>
                  {findObjectByPropertyValue(
                    tablesPropertiesQuery.data,
                    'name',
                    table
                  )?.fields?.map((value, index) => {
                    if (!value.relationName) return <th key={index}>{value.name}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {tableData.map((value, index) => {
                  return (
                    <tr key={index}>
                      {value.map((value, index) => {
                        return <td key={index}>{value}</td>
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          ) : loading ? ( // If the loading state is true
            <Loader />
          ) : (
            // If there is not data
            <Center>{t('noData')}</Center>
          )}
        </ScrollArea>
      </Container>
    </>
  )
}
