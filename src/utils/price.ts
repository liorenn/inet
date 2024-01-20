import { PrismaClient } from '@prisma/client'
import { currrencyApiUrl } from 'config'

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export async function fetchCurrentPrice(deviceModel: string) {
  const prisma = new PrismaClient()
  const gsmarena = require('gsmarena-api')
  try {
    const devices = await gsmarena.catalog.getBrand('apple-phones-48')
    let deviceID: any = null
    devices.forEach((device: any) => {
      const deviceName = device.name as string
      if (
        deviceName.toLowerCase().replace(/\s/g, '') === deviceModel.toLowerCase().replace(/\s/g, '')
      ) {
        deviceID = device.id
      }
    })
    const device = await gsmarena.catalog.getDevice(deviceID)
    const price = device.detailSpec[12].specifications.find((item: any) => item.name === 'Price')
      .value as string
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

export async function convertPrice(price: number, currency: string, targetCurrency: string) {
  const response = await fetch(
    `${currrencyApiUrl}&currencies=${targetCurrency}&base_currency=${currency}`
  )
  const data = await response.json()
  const convertedPrice = price * data.data[targetCurrency]
  return convertedPrice
}

async function FormatPrice(priceString: string) {
  if (priceString.includes('$')) {
    const dollarIndex = priceString.indexOf('$')
    const dollarNumber = priceString
      .slice(dollarIndex + 1)
      .trim()
      .split(' ')[0]
    return parseFloat(dollarNumber)
  } else {
    const response = await fetch(`${currrencyApiUrl}&currencies=$USD&base_currency=$EUR`)
    const data = await response.json()
    const extractedNumber = parseFloat(priceString.split(' ')[1])
    return extractedNumber * data.data.USD
  }
}
