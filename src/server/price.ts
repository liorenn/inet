import { PrismaClient } from '@prisma/client' // Importing Prisma Client
import { env } from '@/server/env' // Importing server environment variables

// Function to fetch the current price of a device model
export async function fetchCurrentPrice(deviceModel: string) {
  const prisma = new PrismaClient() // Initialize the Prisma Client
  const device = await prisma.device.findFirst({
    where: {
      model: deviceModel,
    },
  }) // Get the device from the database with the given device model
  if (!device || (device.type !== 'iphone' && device.type !== 'ipad')) return 0 // Return zero if device was not found

  const gsmarena = require('gsmarena-api') //create the api client

  const search = await gsmarena.search.search(
    device.name.toLowerCase().includes('ipad pro')
      ? 'Apple iPad Pro 12.9'
      : device.name.toLowerCase()
  ) // Search for the device in the api
  const deviceID =
    search.find((item: { name: string }) =>
      isGsmarenaNameEquals(item.name, device.name, device.type)
    ).id ?? '' // Get the device id from the api

  const apiDevice = await gsmarena.catalog.getDevice(deviceID) // Get the device details

  const price = apiDevice.detailSpec[12].specifications.find((item: any) => item.name === 'Price')
    .value as string // Extract the price from the device details

  const formatterPrice = await FormatPrice(price) // Format the price

  await prisma.device.update({
    where: { model: deviceModel },
    data: { price: formatterPrice },
  }) // Update the price in the database

  return formatterPrice // Return the formatted price
}

// Function to check if the gsmarena name is equal to the name of the device in the database
function isGsmarenaNameEquals(gsmarenaName: string, name: string, deviceType: string): boolean {
  // If device type is iphone
  if (deviceType === 'iphone') {
    // Return if both names with trimmed out whitspaces and lowercased are equal
    return (
      gsmarenaName.toLowerCase().replace(/\s|apple/g, '') === name.toLowerCase().replace(/\s/g, '')
    )
  }
  // Match the ipad name to lowercase without whitespaces to get the gsmarena name
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
    default: // Return false if no match
      return false
  }
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
