import {
  IconDeviceAirpods,
  IconDeviceDesktop,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDevices,
  IconDevicesPc,
  IconSearch,
} from '@tabler/icons'
import { NextRouter, useRouter } from 'next/router'
import { ReactNode, useMemo } from 'react'

import { Device } from '@prisma/client'
import type { SpotlightAction } from '@mantine/spotlight'
import { SpotlightProvider } from '@mantine/spotlight'
import { Translate } from 'next-translate'
import { trpc } from '@/utils/client'
import useTranslation from 'next-translate/useTranslation'

/* eslint-disable @typescript-eslint/restrict-template-expressions */
function createActionsArray(
  t: Translate,
  devices: Device[],
  router: NextRouter
): SpotlightAction[] {
  return devices.map((device) => ({
    title: device.name,
    group: t(device.type),
    description: getDeviceDescription(device),
    onTrigger: () => router.push(`/device/${device.type}/${device.model}`),
    icon: icons.find((icon) => icon.type === device.type)?.icon ?? <IconDevices size={28} />,
  }))
}

const icons = [
  {
    type: 'iphone',
    icon: <IconDeviceMobile size={28} />,
  },
  {
    type: 'ipad',
    icon: <IconDeviceTablet size={28} />,
  },
  {
    type: 'airpods',
    icon: <IconDeviceAirpods size={28} />,
  },
  {
    type: 'mac',
    icon: <IconDevicesPc size={28} />,
  },
  {
    type: 'imac',
    icon: <IconDeviceDesktop size={28} />,
  },
  {
    type: 'macbook',
    icon: <IconDeviceLaptop size={28} />,
  },
]

function getDeviceDescription(device: Device) {
  switch (device.type) {
    case 'iphone':
      return `${device.name} is a iPhone with a ${device.screenSize} inch ${device.screenType} display and a ${device.batterySize} mah cpacity battery`
    case 'ipad':
      return `${device.name} is a iPad with a ${device.screenSize} inch ${device.screenType} display and a ${device.batterySize} mah cpacity battery`
    case 'airpods':
      return `${device.name} is an Airpods with a ${device.chipset} chipset and a ${device.batterySize} mah cpacity battery`
    case 'mac':
      return `${device.name} is a Mac computer with a ${device.cpu} core cpu and a ${device.gpu} core gpu with a ${device.memory} gb memory`
    case 'imac':
      return `${device.name} is a Desktop Computer with a ${device.screenSize} inch display and a ${device.cpu} core cpu and a ${device.gpu} core gpu`
    case 'macbook':
      return `${device.name} is a Portable Computer with a ${device.screenSize} inch ${device.screenType} display and a ${device.batterySize} mah cpacity battery`
    default:
      return `${device.name} is a ${device.type} with a ${
        device.chipset
      } chipset and was released in ${device.releaseDate.toDateString()} `
  }
}

export default function SpotlightControl({ children }: { children: ReactNode }) {
  const { t } = useTranslation('main') // Get the translation function
  const devicesQuery = trpc.device.getDevicesData.useQuery() // Get the devices data
  const router = useRouter() // Get the router
  const actions = useMemo(() => {
    if (devicesQuery.data) {
      // Check if the data exists
      return createActionsArray(t, devicesQuery.data, router) // Return the actions array
    } else {
      return [] // Return an empty array
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
