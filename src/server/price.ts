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
  const gsmarena = require('gsmarena-api') //create the api client
  try {
    // Fetch devices from the website
    const devices = await gsmarena.catalog.getBrand('apple-phones-48')
    let deviceID: any = null
    // Find the device ID for the specified model
    devices.forEach((device: any) => {
      const deviceName = device.name as string
      if (
        deviceName.toLowerCase().replace(/\s/g, '') === deviceModel.toLowerCase().replace(/\s/g, '')
      ) {
        deviceID = device.id
      }
    })
    // Get the device details
    const device = await gsmarena.catalog.getDevice(deviceID)
    // Extract the price from the device details
    const price = device.detailSpec[12].specifications.find((item: any) => item.name === 'Price')
      .value as string
    // Format the price
    const formatterPrice = await FormatPrice(price)
    // Update the price in the database
    await prisma.device.update({
      where: { model: deviceModel },
      data: { price: formatterPrice },
    })
    return formatterPrice //Return formatted price
  } catch (error) {
    return undefined //Return undefined if an error occurs
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
      `${env.currencyApiUrl}?apikey=${env.currencyApiKey}&currencies=$USD&base_currency=$EUR`
    ) // Fetch the data from the API
    const data = await response.json() // Extract the data from the response
    const extractedNumber = parseFloat(priceString.split(' ')[1]) // Extract the number from the price string
    return extractedNumber * data.data.USD // Return the formatted price
  }
}
