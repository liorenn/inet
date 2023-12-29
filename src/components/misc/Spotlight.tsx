/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { SpotlightProvider } from '@mantine/spotlight'
import type { SpotlightAction } from '@mantine/spotlight'
import {
  IconSearch,
  IconDeviceTablet,
  IconDevices,
  IconDeviceAirpods,
  IconDeviceMobile,
  IconDeviceLaptop,
  IconDeviceDesktop,
  IconDevicesPc,
} from '@tabler/icons'
import { ReactNode, useMemo } from 'react'
import { trpc } from '../../misc/trpc'
import { Device } from '@prisma/client'
import { NextRouter, useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

function createActionsArray(
  devices: Device[],
  router: NextRouter
): SpotlightAction[] {
  return devices.map((device) => ({
    title: device.name,
    group: device.type,
    description: getDeviceDescription(device),
    onTrigger: () => router.push(`/device/${device.type}/${device.model}`),
    icon: getActionIcon(device.type),
  }))
}

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

function getActionIcon(deviceType: string) {
  const size = 32
  switch (deviceType) {
    case 'iphone':
      return <IconDeviceMobile size={size} />
    case 'ipad':
      return <IconDeviceTablet size={size} />
    case 'airpods':
      return <IconDeviceAirpods size={size} />
    case 'mac':
      return <IconDevicesPc size={size} />
    case 'imac':
      return <IconDeviceDesktop size={size} />
    case 'macbook':
      return <IconDeviceLaptop size={size} />
    default:
      return <IconDevices size={size} />
  }
}

export function SpotlightControl({ children }: { children: ReactNode }) {
  const { t } = useTranslation('translations')
  const { data } = trpc.device.getDevicesData.useQuery()
  const router = useRouter()
  const actions = useMemo(() => {
    if (data) {
      return createActionsArray(data, router)
    } else {
      return []
    }
  }, [data, router])

  return (
    <SpotlightProvider
      actions={actions}
      highlightColor='dark'
      searchIcon={<IconSearch size='1.2rem' />}
      searchPlaceholder={t('searchForDevice')}
      nothingFoundMessage={t('deviceNotFound')}
      limit={5}>
      {children}
    </SpotlightProvider>
  )
}
