import { Container, SegmentedControl } from '@mantine/core'
import { useState } from 'react'
import TablesData from '../../components/admin/tablesData'
import DeviceManagement from '../../components/admin/deviceManagement'
import UserManagement from '../../components/admin/userManagement'

export default function Admin() {
  const [page, setPage] = useState('')
  return (
    <>
      <Container size='xl'>
        <SegmentedControl
          data={[
            { value: 'Data', label: 'Data' },
            { value: 'deviceManager', label: 'Devices' },
            { value: 'userManagement', label: 'Users' },
          ]}
          onChange={setPage}
          value={page}
          fullWidth
          size='md'
          radius='md'
          mb='lg'
        />
        {page === 'Data' && <TablesData />}
        {page === 'deviceManager' && <DeviceManagement />}
        {page === 'userManagement' && <UserManagement />}
      </Container>
    </>
  )
}
