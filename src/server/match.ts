/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Device } from '@prisma/client'
import similarity from 'compute-cosine-similarity'

// i get [{battery: 1, screen: 3, price: 4}]
//then it becomes [{battery: 2000, screen: 6, price: 1200}]
//and i have[2000, 3000, 5000] - all the values in database
//i get the normilized value of each property of the preferences
// and the normilized value of each property in the database
// and then for each device i compare it with the preference

export type weightValueType = {
  name: string
  values: number[]
}

const weightsValues: weightValueType[] = [
  { name: 'screenSize', values: [5, 6, 7, 8] },
  { name: 'batterySize', values: [3800, 4100, 4500, 5000] },
  { name: 'price', values: [600, 900, 1100, 1300] },
  { name: 'memory', values: [8, 16, 32, 64] },
  { name: 'cpu', values: [2, 4, 6, 8] },
  { name: 'gpu', values: [2, 4, 6, 8] },
  { name: 'weight', values: [2, 4, 6, 8] },
  { name: 'storage', values: [8, 16, 32, 64] },
]

export type matchDeviceType = Pick<
  Device,
  | 'model'
  | 'screenSize'
  | 'batterySize'
  | 'price'
  | 'storage'
  | 'memory'
  | 'weight'
  | 'cpu'
  | 'gpu'
>
export type matchProperty = keyof Omit<matchDeviceType, 'model'>

export type recommendedDevice = {
  model: string
  match: number
}

export type mergedValuesType = {
  name: matchProperty
  prefValue: number
  devicesValues: {
    model: string
    value: number
  }[]
}[]

//number is between 1 to 4
export type preferenceType = {
  name: matchProperty
  value: number
}

export function getMatchedDevices(
  preferences: preferenceType[],
  devices: matchDeviceType[]
): recommendedDevice[] {
  const preferencesValues = convertPreferencesToValues(preferences)
  const mergedValues: mergedValuesType = preferencesValues.map((pref) => {
    return {
      name: pref.name,
      prefValue: pref.value,
      devicesValues: devices.map((device) => {
        return { model: device.model, value: device[pref.name] ?? 0 }
      }),
    }
  })
  const normilizedValues: mergedValuesType = mergedValues.map((value) => {
    return {
      name: value.name,
      prefValue: getNormalizedValue(
        value.prefValue,
        value.devicesValues.map((value) => value.value)
      ),
      devicesValues: value.devicesValues.map((device) => {
        return {
          model: device.model,
          value: getNormalizedValue(
            device.value,
            value.devicesValues.map((value) => value.value)
          ),
        }
      }),
    }
  })
  const totalPrefsValues = normilizedValues.map((value) => value.prefValue)
  const recommendedDevices: recommendedDevice[] = []
  const totalDevicesValues: totalDevicesType[] =
    convertToTotalDevicesValues(normilizedValues)
  totalDevicesValues.map((device) => {
    recommendedDevices.push({
      model: device.model,
      match: formatNumber(getSimilarity(totalPrefsValues, device.values)),
    })
  })
  return recommendedDevices
}

function formatNumber(num: number) {
  const decimalPlaces = 2
  num = ((num + 1) / 2) * 100
  const factor = Math.pow(10, decimalPlaces)
  return Math.round(num * factor) / factor
}

export type totalDevicesType = {
  model: string
  values: number[]
}

function convertToTotalDevicesValues(
  merged: mergedValuesType
): totalDevicesType[] {
  const totalDevices: totalDevicesType[] = []
  const models = merged[0].devicesValues.map((device) => device.model)
  models.forEach((model) => {
    const values: number[] = []
    merged.map((value) => {
      values.push(
        value.devicesValues.find((device) => device.model === model)?.value ?? 0
      )
    })
    totalDevices.push({ model: model, values: values })
  })
  return totalDevices
}

function convertPreferencesToValues(
  preferences: preferenceType[]
): preferenceType[] {
  return preferences.map((pref) => {
    return {
      name: pref.name,
      value:
        weightsValues.find((value) => value.name === pref.name)?.values[
          pref.value - 1
        ] ?? 0,
    }
  })
}

function calculateMean(values: number[]) {
  return values.reduce((a, b) => a + b, 0) / values.length
}

function calculateStandardDeviation(values: number[]) {
  let sum = 0
  const mean = calculateMean(values)
  values.forEach((value) => (sum += Math.pow(value - mean, 2)))
  return Math.sqrt(sum / values.length)
}

function getNormalizedValue(value: number, values: number[]) {
  const mean = calculateMean(values)
  const standardDeviation = calculateStandardDeviation(values)
  return (value - mean) / standardDeviation
}

//both normilized
function getSimilarity(preferences: number[], values: number[]) {
  return similarity(preferences, values) ?? 0
}
