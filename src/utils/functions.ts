import { showNotification } from '@mantine/notifications'
import { DeviceTypeValue } from '@prisma/client'
import { IconCheck, IconX, IconExclamationMark } from '@tabler/icons'
import { ReactElement } from 'react'

export function FormatDate(releaseDate: Date): string {
  const date = new Date(releaseDate)
  const day = date.getUTCDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return day + '/' + month + '/' + year
}

export function CreateNotification(
  message: string,
  color: 'red' | 'green' | 'yellow'
) {
  const icon: ReactElement<any, any> | null = getIcon()

  function getIcon(): ReactElement<any, any> | null {
    if (color === 'green') {
      return IconCheck({})
    } else if (color === 'yellow') {
      return IconExclamationMark({})
    } else if (color === 'red') {
      return IconX({})
    }
    return IconExclamationMark({})
  }

  return showNotification({
    title: message,
    message: '',
    color: color,
    autoClose: 6000,
    radius: 'md',
    icon: icon,
    style: {
      width: '60%',
      float: 'right',
    },
  })
}

export function getDeviceType(deviceModel: string) {
  const devicesTypes = Object.getOwnPropertyNames(DeviceTypeValue)
  for (let i = 0; i < devicesTypes.length; i++) {
    if (deviceModel.includes(devicesTypes[i]) && devicesTypes[i] !== 'mac') {
      //because imac and macbook contain the word mac so it would always return mac
      return devicesTypes[i]
    }
  }
  return 'unknown'
}
