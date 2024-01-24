import { Center, Container, ScrollArea, SegmentedControl, Table } from '@mantine/core'
import { useSession, useUser } from '@supabase/auth-helpers-react'

import Loader from '@/components/layout/Loader'
import { managerAccessKey } from 'config'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

type props = {
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

export default function DatabaseViewer({ accessKey }: props) {
  const user = useUser() // Get the user object from Supabase
  const router = useRouter() // Get the router object from Next.js
  const session = useSession() // Get the session object from Supabase
  const { t } = useTranslation('translations') // Get the translation function from Next.js
  const [table, setTable] = useState('') // State variable to store the selected table
  const { data: tableColumns } = trpc.auth.getTablesColumns.useQuery() // Query to get the columns of the selected table
  const { mutate } = trpc.auth.getTableData.useMutation() // Mutation to get the data of the selected table
  const [tableData, setTableData] = useState<string[][]>([]) // State variable to store the data of the selected table

  if (accessKey < managerAccessKey) {
    // If the access key is less than the manager access key
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/') // Redirect to the home page
  }

  function changeTableName(tableName: string) {
    setTable(tableName)
    mutate(
      { tableName: tableName },
      {
        onSuccess(unknownData) {
          const data = unknownData as any
          const stringArrays: string[][] = data.map((obj: any) =>
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
          setTableData(stringArrays)
        },
      }
    )
  }

  if (!(user && session)) {
    return <Center>{t('accessDeniedMessageSignIn')}</Center>
  }

  if (!(tableColumns && tableData)) {
    return <Loader />
  }

  return (
    <>
      <Container size='xl'>
        <ScrollArea>
          <SegmentedControl
            data={tableColumns.map((value) => value.name)}
            onChange={(tableName) => changeTableName(tableName)}
            value={table}
            fullWidth
            size='md'
            radius='md'
            mb='lg'
          />
        </ScrollArea>
        <ScrollArea>
          <Table striped highlightOnHover withBorder withColumnBorders>
            <thead>
              <tr>
                {tableData.length > 0 &&
                  findObjectByPropertyValue(tableColumns, 'name', table)?.fields.map(
                    (value, index) => {
                      if (!value.relationName) return <th key={index}>{value.name}</th>
                    }
                  )}
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
        </ScrollArea>
      </Container>
    </>
  )
}
