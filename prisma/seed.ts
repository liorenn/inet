import { biometricFeatures, cameraTypes, deviceConnectors, deviceTypes } from '~/data/enums'

import { airpods as Airpods } from '~/data/airpods'
import { Colors } from '~/data/colors'
import { Macbooks } from '~/data/macbooks'
import { Macs } from '~/data/macs'
import { PrismaClient } from '@prisma/client'
import { iMacs } from '~/data/imacs'
import { iPads } from '~/data/ipads'
import { iPhones } from '~/data/iphones'

const db = new PrismaClient()

export async function seedDatabase() {
  try {
    await db.color.deleteMany() // Delete all color table data
    await db.device.deleteMany() // Delete all device table data
    await db.deviceType.deleteMany() // Delete all device type table data
    await db.cameraType.deleteMany() // Delete all camera type table data
    await db.deviceConnector.deleteMany() // Delete all device connector table data
    await db.biometricFeature.deleteMany() // Delete all biometric feature table data

    await db.deviceType.createMany({
      data: [...deviceTypes]
    }) // Create all device types

    await db.cameraType.createMany({
      data: [...cameraTypes]
    }) // Create all camera types

    await db.deviceConnector.createMany({
      data: [...deviceConnectors]
    }) // Create all device connectors

    await db.biometricFeature.createMany({
      data: [...biometricFeatures]
    }) // Create all biometric features

    // Create all colors
    await Promise.all(
      Colors.map(async (color) => {
        await db.color.create({
          data: { name: color.name, hex: color.hex }
        })
      })
    )

    // Create all iphones
    await Promise.all(
      iPhones.map(async (iphone) => {
        await db.device.create({
          data: iphone
        })
      })
    )

    // Create all ipads
    await Promise.all(
      iPads.map(async (ipad) => {
        await db.device.create({
          data: ipad
        })
      })
    )

    // Create all airpods
    await Promise.all(
      Airpods.map(async (airpods) => {
        await db.device.create({
          data: airpods
        })
      })
    )

    // Create all macs
    await Promise.all(
      Macs.map(async (mac) => {
        await db.device.create({
          data: mac
        })
      })
    )

    // Create all imacs
    await Promise.all(
      iMacs.map(async (imac) => {
        await db.device.create({
          data: imac
        })
      })
    )

    // Create all macbooks
    await Promise.all(
      Macbooks.map(async (macbook) => {
        await db.device.create({
          data: macbook
        })
      })
    )

    console.log('Database seeding completed.')
  } catch (error) {
    console.error('Seeding error:', error)
    throw error
  } finally {
    await db.$disconnect() // Disconnect from the database
  }
}
