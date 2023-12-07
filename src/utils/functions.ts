import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX, IconExclamationMark } from '@tabler/icons'
import { type ReactElement } from 'react'
import type { Comment } from '@prisma/client'
import { deviceType } from './deviceTypes'

export async function convertPrice(
  price: number,
  currency: string,
  targetCurrency: string
) {
  const response = await fetch(
    'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_yepX15sCjHvHFsdPr4zLPPWIIQ49wOkQZSGdl8l9' +
      '&currencies=' +
      targetCurrency +
      '&base_currency=' +
      currency
  )
  const data = await response.json()
  const convertedPrice = price * data.data[targetCurrency]
  return convertedPrice
}
export async function FormatPrice(priceString: string) {
  if (priceString.includes('$')) {
    const dollarIndex = priceString.indexOf('$')
    const dollarNumber = priceString
      .slice(dollarIndex + 1)
      .trim()
      .split(' ')[0]
    return parseFloat(dollarNumber)
  } else {
    const response = await fetch(
      `https://api.freecurrencyapi.com/v1/latest?apikey=
        ${process.env.CURRENCY_API_KEY}
        &currencies=USD&base_currency=EUR`
    )
    const data = await response.json()
    const extractedNumber = parseFloat(priceString.split(' ')[1])
    return extractedNumber * data.data.USD
  }
}

export function FormatDate(releaseDate: Date): string {
  const date = new Date(releaseDate)
  const day = date.getUTCDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return day.toString() + '/' + month.toString() + '/' + year.toString()
}

export function CreateNotification(
  message: string,
  color: 'red' | 'green' | 'yellow',
  mobile?: boolean
) {
  const icon: ReactElement | null = getIcon()

  function getIcon(): ReactElement | null {
    if (color === 'green') {
      return IconCheck({})
    } else if (color === 'yellow') {
      return IconExclamationMark({})
    } else if (color === 'red') {
      return IconX({})
    }
    return IconExclamationMark({})
  }

  if (mobile) {
    return showNotification({
      title: message,
      message: '',
      color: color,
      autoClose: 6000,
      radius: 'md',
      icon: icon,
      style: { width: '60%', float: 'right', marginBottom: '40px' },
    })
  } else {
    return showNotification({
      title: message,
      message: '',
      color: color,
      autoClose: 6000,
      radius: 'md',
      icon: icon,
      style: { width: '60%', float: 'right' },
    })
  }
}

export function getDeviceType(deviceModel: string) {
  const devicesTypes = Object.getOwnPropertyNames(deviceType)
  for (let i = 0; i < devicesTypes.length; i++) {
    if (deviceModel.includes(devicesTypes[i]) && devicesTypes[i] !== 'mac') {
      //because imac and macbook contain the word mac so it would always return mac
      return devicesTypes[i]
    }
  }
  return 'unknown'
}

export function CalcAverageRating(comments: Comment[]) {
  let AverageRating = 0
  for (let i = 0; i < comments.length; i++) {
    AverageRating += comments[i].Rating
  }
  AverageRating /= comments.length
  return AverageRating
}
