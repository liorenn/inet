import { Box, ScrollArea, SegmentedControl } from '@mantine/core'
import { parseAsStringEnum, useQueryState } from 'nuqs'

import AdminPage from '@/components/pages/AdminPage'
import DatabaseViewer from '@/components/admin/DatabaseViewer'
import DeviceManagement from '@/components/admin/DeviceManagement'
import Loader from '@/components/layout/Loader'
import SiteSettingsEditor from '@/components/admin/SiteSettingsEditor'
import UserManagement from '@/components/admin/UserManagement'
import WebsiteStatistics from '@/components/admin/WebsiteStatistics'
import { api } from '@/lib/trpc'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'
import { z } from 'zod'

const dashboardEnum = z.enum([
  'deviceManagement',
  'userManagement',
  'databaseViewer',
  'siteSettings',
  'websiteStatistics'
])

type Dashboard = z.infer<typeof dashboardEnum>

export default function Admin() {
  const { width } = useViewportSize() // Get the width of the viewport
  const { t } = useTranslation('main')
  const [dashboard, setDashboard] = useQueryState(
    'dashboard',
    parseAsStringEnum(Object.values(dashboardEnum.Enum)).withDefault('deviceManagement')
  )
  const { data: user } = api.auth.getUser.useQuery() // Get the user

  // Define accessible values for admin and manager roles
  const accessibleDashBoards: Dashboard[] =
    user && user.role === 'admin'
      ? ['deviceManagement'] // Only deviceManagement for admin
      : [
          'deviceManagement',
          'userManagement',
          'websiteStatistics',
          'siteSettings',
          'databaseViewer'
        ] // All for manager

  // Create buttons based on the enum and accessibility
  const buttons = dashboardEnum.options
    .filter((option) => accessibleDashBoards.includes(option)) // Filter based on role
    .map((option) => ({
      value: option,
      label: t(option) // Translate using the enum key
    }))

  return (
    <AdminPage
      container='xl'
      title={buttons.find((b) => b.value === dashboard)?.label ?? t('deviceManagement')}>
      {user ? (
        <Box mx='md'>
          <ScrollArea offsetScrollbars mb='md' type={width < 400 ? 'always' : 'auto'}>
            <SegmentedControl
              data={buttons}
              onChange={(value: Dashboard) => {
                setDashboard(value)
              }}
              value={dashboard}
              fullWidth
              size='md'
              radius='md'
              mb='sm'
            />
          </ScrollArea>
          {dashboard === 'databaseViewer' && user.role === 'manager' && <DatabaseViewer />}
          {dashboard === 'deviceManagement' &&
            (user.role === 'admin' || user.role === 'manager') && <DeviceManagement />}
          {dashboard === 'userManagement' && user.role === 'manager' && <UserManagement />}
          {dashboard === 'websiteStatistics' && user.role === 'manager' && <WebsiteStatistics />}
          {dashboard === 'siteSettings' && user.role === 'manager' && <SiteSettingsEditor />}
        </Box>
      ) : (
        <Loader />
      )}
    </AdminPage>
  )
}
