import {
  IconDeviceAirpods,
  IconDeviceDesktop,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDevices,
  IconDevicesPc,
  IconSearch
} from '@tabler/icons-react'
import { NextRouter, useRouter } from 'next/router'
import { ReactNode, useMemo } from 'react'

import { Device } from '@prisma/client'
import type { SpotlightAction } from '@mantine/spotlight'
import { SpotlightProvider } from '@mantine/spotlight'
import { Translate } from 'next-translate'
import { api } from '@/lib/trpc'
import useTranslation from 'next-translate/useTranslation'

// Define an icon for each device type
const icons = [
  {
    type: 'iphone',
    icon: <IconDeviceMobile size={28} />
  },
  {
    type: 'ipad',
    icon: <IconDeviceTablet size={28} />
  },
  {
    type: 'airpods',
    icon: <IconDeviceAirpods size={28} />
  },
  {
    type: 'mac',
    icon: <IconDevicesPc size={28} />
  },
  {
    type: 'imac',
    icon: <IconDeviceDesktop size={28} />
  },
  {
    type: 'macbook',
    icon: <IconDeviceLaptop size={28} />
  }
]

// Get the device description that will be shown in the spotlight
function getDeviceDescription(device: Device) {
  // Match each device type with its description
  switch (device.type) {
    case 'iphone':
      return `${device.name} is a iPhone with a ${device.screenSize} inch and a ${device.batterySize} mah cpacity battery`
    case 'ipad':
      return `${device.name} is a iPad with a ${device.screenSize} inch and a ${device.batterySize} mah cpacity battery`
    case 'airpods':
      return `${device.name} is an Airpods with a ${device.chipset} chipset and a ${device.batterySize} mah battery`
    case 'mac':
      return `${device.name} is a Mac computer with a ${device.cpu} core cpu and a ${device.gpu} core gpu`
    case 'imac':
      return `${device.name} is a Desktop Computer with a ${device.screenSize} inch display and a ${device.cpu} core cpu`
    case 'macbook':
      return `${device.name} is a Portable Computer with a ${device.screenSize} inch and a ${device.batterySize} mah cpacity battery`
    default: // Create a default description
      return `${device.name} is a ${
        device.type
      } that was released in ${device.releaseDate.toDateString()}`
  }
}

// Create the actions array for the spotlight
function createActionsArray(
  t: Translate,
  devices: Device[],
  router: NextRouter
): SpotlightAction[] {
  return devices.map((device) => ({
    title: device.name,
    group: t(device.type), // Set the group to the translated device type
    description: getDeviceDescription(device), // Set the description to the device description
    onTrigger: () => router.push(`/device/${device.type}/${device.model}`), // Set the trigger function to navigate to the device page
    icon: icons.find((icon) => icon.type === device.type)?.icon ?? <IconDevices size={28} /> // Set the icon to the device icon
  }))
}

export default function SpotlightControl({ children }: { children: ReactNode }) {
  const { t } = useTranslation('main') // Get the translation function
  const devicesQuery = api.device.getDevicesData.useQuery() // Get the devices data
  const router = useRouter() // Get the router
  const actions = useMemo(() => {
    // Check if the data exists
    if (devicesQuery.data) {
      return createActionsArray(t, devicesQuery.data, router) // Return the actions array
    } else {
      return [] // Return an empty array
    }
  }, [devicesQuery.data, router])

  return (
    <SpotlightProvider
      actions={actions}
      highlightColor='dark'
      searchIcon={<IconSearch size={22} stroke={2.8} />}
      searchPlaceholder={t('searchForDevice')}
      nothingFoundMessage={t('deviceNotFound')}
      limit={devicesQuery.data?.length}>
      {children}
    </SpotlightProvider>
  )
}
