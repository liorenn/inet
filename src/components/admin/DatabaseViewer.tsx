import { Center, Container, ScrollArea, SegmentedControl, Table } from '@mantine/core'

import Loader from '@/components/layout/Loader'
import { api } from '@/lib/trpc'
import { useRouter } from 'next/router'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'

export default function DatabaseViewer() {
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const { width } = useViewportSize() // Get the viewport size
  const { t } = useTranslation('main') // Get the translation function from Next.js
  const [table, setTable] = useState('') // State variable to store the selected table
  const [loading, setLoading] = useState(false) // State variable to store the loading state
  const tablesPropertiesQuery = api.admin.getTablesProperties.useQuery() // Query to get the properties of the tables
  const getTableDataMutation = api.admin.getTableData.useMutation() // Mutation to get the data of the selected table
  const [tableData, setTableData] = useState<string[][]>([]) // State variable to store the data of the selected table

  // Change the table name
  function changeTableName(tableName: string) {
    setLoading(true) // Set the loading state to true
    setTable(tableName) // Set the selected table
    // Get the data of the selected table
    getTableDataMutation.mutate(
      { tableName: tableName },
      {
        onSuccess(unknownData) {
          const data = unknownData as any // Cast the unknown data to an array
          const stringArrays: string[][] = data.map((obj: any) =>
            // Convert the unknown data to an array of objects
            Object.values(obj).map((value) => {
              // If the value is a date
              if (value instanceof Date) {
                // Convert the value to a string
                return value.toLocaleDateString('en-us', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              }
              return String(value) // Convert the value to a string
            })
          )
          setTableData(stringArrays) // Set the data of the selected table
          setLoading(false) // Set the loading state to false
        }
      }
    )
  }

  // If the user or session is not available
  if (!user) {
    return <Center>{t('accessDeniedMessageSignIn')}</Center>
  }

  // If the tables names or data is not loaded
  if (!(tablesPropertiesQuery.data && tableData)) {
    return <Loader />
  }

  return (
    <>
      <Container size='xl'>
        <ScrollArea offsetScrollbars mb='lg' type={width < 400 ? 'always' : 'auto'}>
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
        <ScrollArea offsetScrollbars type={width < 400 ? 'always' : 'auto'}>
          {tableData.length > 0 && !loading ? ( // If there is data and the data finished loading
            <Table striped highlightOnHover withBorder withColumnBorders>
              <thead>
                <tr>
                  {tablesPropertiesQuery.data
                    .find((item) => item.name === table)
                    ?.fields?.map((value, index) => {
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
