import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX, IconExclamationMark } from '@tabler/icons'
import { type ReactElement } from 'react'
import { PrismaClient, type Comment } from '@prisma/client'
import { currencyApiKey } from '../../config'

export async function fetchCurrentPrice(deviceModel: string) {
  const prisma = new PrismaClient()
  const gsmarena = require('gsmarena-api')
  try {
    const devices = await gsmarena.catalog.getBrand('apple-phones-48')
    let deviceID: any = null
    devices.forEach(async (device: any) => {
      const deviceName = device.name as string
      if (
        deviceName.toLowerCase().replace(/\s/g, '') ===
        deviceModel.toLowerCase().replace(/\s/g, '')
      ) {
        deviceID = device.id
      }
    })
    const device = await gsmarena.catalog.getDevice(deviceID)
    const price = device.detailSpec[12].specifications.find(
      (item: any) => item.name === 'Price'
    ).value
    const formatterPrice = await FormatPrice(price)
    await prisma.device.update({
      where: { model: deviceModel },
      data: { price: formatterPrice },
    })
    return formatterPrice
  } catch (error) {
    return undefined
  }
}

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
        ${currencyApiKey}
        &currencies=USD&base_currency=EUR`
    )
    const data = await response.json()
    const extractedNumber = parseFloat(priceString.split(' ')[1])
    return extractedNumber * data.data.USD
  }
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

export function calculateAverageRating(comments: Comment[]) {
  let AverageRating = 0
  for (let i = 0; i < comments.length; i++) {
    AverageRating += comments[i].rating
  }
  AverageRating /= comments.length
  return AverageRating
}

export function FormatDate(releaseDate: Date): string {
  const date = new Date(releaseDate)
  const day = date.getUTCDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return day.toString() + '/' + month.toString() + '/' + year.toString()
}

export function findObjectByPropertyValue<T>(
  array: T[],
  name: keyof T,
  value: T[keyof T]
) {
  return array.find((item) => item[name] === value)
}

export function calculatePercentageDiff(
  oldPrice: number,
  newPrice: number
): number {
  if (oldPrice === 0) {
    return 0
  }
  const absoluteDifference = Math.abs(oldPrice - newPrice)
  const percentageDifference = (absoluteDifference / oldPrice) * 100
  return percentageDifference
}

export function encodeEmail(email: string) {
  return btoa(email)
}

export function decodeEmail(encodedEmail: string) {
  return atob(encodedEmail)
}
