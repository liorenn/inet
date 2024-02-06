import { PrismaClient } from '@prisma/client' // Importing Prisma Client
import { env } from '@/server/env' // Importing server environment variables

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// Function to fetch the current price of a device model
export async function fetchCurrentPrice(deviceModel: string) {
  const prisma = new PrismaClient()
  const device = await prisma.device.findFirst({
    where: {
      model: deviceModel,
    },
  })
  const gsmarena = require('gsmarena-api') //create the api client
  if (!device) return 0
  const search = await gsmarena.search.search(
    device.name.toLowerCase().includes('ipad pro')
      ? 'Apple iPad Pro 12.9'
      : device.name.toLowerCase()
  )
  const deviceID =
    search.find((item: { name: string }) =>
      isGsmarenaNameEquals(item.name, device.name, device.type)
    ).id ?? ''
  //apple_iphone_13_pro_max-11089
  // Get the device details
  const apiDevice = await gsmarena.catalog.getDevice(deviceID)
  // Extract the price from the device details
  const price = apiDevice.detailSpec[12].specifications.find((item: any) => item.name === 'Price')
    .value as string
  // Format the price
  const formatterPrice = await FormatPrice(price)

  console.log(price, formatterPrice)
  // Update the price in the database
  await prisma.device.update({
    where: { model: deviceModel },
    data: { price: formatterPrice },
  })
  return formatterPrice
}

// Function to convert the price to a different currency
export async function convertPrice(price: number, currency: string, targetCurrency: string) {
  const response = await fetch(
    `${env.currencyApiUrl}?apikey=${env.currencyApiKey}&currencies=${targetCurrency}&base_currency=${currency}`
  ) // Fetch the data from the API
  const data = await response.json() // Extract the data from the response
  return price * data.data[targetCurrency] // Convert and return the price
}

// Function to format the price
async function FormatPrice(priceString: string) {
  if (priceString.includes('$')) {
    const dollarIndex = priceString.indexOf('$') // Find the index of the dollar sign
    const dollarNumber = priceString
      .slice(dollarIndex + 1)
      .trim()
      .split(' ')[0] // Extract the number after the dollar sign
    return parseFloat(dollarNumber) // Return the formatted price
  } else {
    const response = await fetch(
      `${env.currencyApiUrl}?apikey=${env.currencyApiKey}&currencies=USD&base_currency=EUR`
    ) // Fetch the data from the API
    const data = await response.json() // Extract the data from the response
    const extractedNumber = parseFloat(priceString.split(' ')[1]) // Extract the number from the price string
    return extractedNumber * data.data.USD // Return the formatted price
  }
}

function isGsmarenaNameEquals(gsmarenaName: string, name: string, deviceType: string): boolean {
  if (deviceType === 'iphone') {
    return (
      gsmarenaName.toLowerCase().replace(/\s|apple/g, '') === name.toLowerCase().replace(/\s/g, '')
    )
  }
  switch (name.toLowerCase().replace(/\s/g, '')) {
    case 'ipad10':
      return gsmarenaName === 'Apple iPad (2022)'
    case 'ipad9':
      return gsmarenaName === 'Apple iPad 10.2 (2021)'
    case 'ipad8':
      return gsmarenaName === 'Apple iPad 10.2 (2020)'
    case 'ipadair4':
      return gsmarenaName === 'Apple iPad Air (2020)'
    case 'ipadair5':
      return gsmarenaName === 'Apple iPad Air (2022)'
    case 'ipadmini5':
      return gsmarenaName === 'Apple iPad mini (2019)'
    case 'ipadmini6':
      return gsmarenaName === 'Apple iPad mini (2021)'
    case 'ipadpro3':
      return gsmarenaName === 'Apple iPad Pro 12.9 (2018)'
    case 'ipadpro4':
      return gsmarenaName === 'Apple iPad Pro 12.9 (2020)'
    case 'ipadpro5':
      return gsmarenaName === 'Apple iPad Pro 12.9 (2021)'
    case 'ipadpro6':
      return gsmarenaName === 'Apple iPad Pro 12.9 (2022)'
    default:
      return false
  }
}
