import Head from 'next/head'
import { Center, Loader, Table } from '@mantine/core'
import { useUser, useSession } from '@supabase/auth-helpers-react'
import { trpc } from '../../utils/trpc'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'

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
  const { data: tableColumns } = trpc.admin.getDeviceColumns.useQuery()

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
    <Table striped highlightOnHover withBorder withColumnBorders>
      <thead>
        <tr>
          {getObject(tableColumns, 'name', 'Device')?.fields.map((value) => {
            return <th key={value.name}>{value.name}</th>
          })}
        </tr>
      </thead>
    </Table>
  )
}

export default Admin
