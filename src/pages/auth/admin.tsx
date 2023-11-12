import Head from 'next/head'
import {
  Center,
  Container,
  Loader,
  SegmentedControl,
  Table,
} from '@mantine/core'
import { useUser, useSession } from '@supabase/auth-helpers-react'
import { trpc } from '../../utils/trpc'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'
import { useState } from 'react'

function getObject<T extends object>(
  array: T[],
  name: keyof T,
  value: T[keyof T]
) {
  return array.find((item) => item[name] === value)
}

const Admin = () => {
  const user = useUser()
  const session = useSession()
  const { t } = useTranslation('auth')
  const { height } = useViewportSize()
  const [table, setTable] = useState('')
  const { data: tableColumns } = trpc.admin.getDeviceColumns.useQuery()
  const { mutate } = trpc.admin.getTableData.useMutation()
  const [tableData, setTableData] = useState<string[][]>([])
  console.log(tableColumns)

  function changeTableName(tableName: string) {
    setTable(tableName)
    mutate(
      { tableName: tableName },
      {
        onSuccess(unknownData) {
          const data = unknownData as any
          const stringArrays: string[][] = data.map((obj: any) =>
            Object.values(obj).map((val) => String(val))
          )
          setTableData(stringArrays)
        },
      }
    )
  }

  if (!(user && session)) {
    return <Center>{t('accessDeniedMessageSignIn')}</Center>
  }

  if (!tableColumns) {
    return (
      <>
        <Head>
          <title>{t('account')}</title>
        </Head>
        <Center>
          <Loader color='gray' size={120} variant='dots' mt={height / 3} />
        </Center>
      </>
    )
  }

  console.log

  return (
    <>
      <Container size='xl'>
        <SegmentedControl
          data={tableColumns.map((value) => value.name)}
          onChange={(tableName) => changeTableName(tableName)}
          value={table}
          fullWidth
          size='md'
          radius='md'
          mb='lg'
        />
        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              {getObject(tableColumns, 'name', table)?.fields.map(
                (value, index) => {
                  if (!value.relationName)
                    return <th key={index}>{value.name}</th>
                }
              )}
            </tr>
          </thead>
          <tbody>
            {tableData &&
              tableData.map((value, index) => {
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
      </Container>
    </>
  )
}

export default Admin
