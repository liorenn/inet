import { deviceTypeProperties, weight, weightsValues } from '@/models/deviceProperties'
import { matchDeviceType, preprtiesSchemaType } from '@/models/schemas'

import { recommendedDevicesLimit } from 'config'

type recommendedDevice = {
  model: string
  match: number
}

// Function to get matched devices based on preference values, devices, device type, and limit
export function getMatchedDevices(
  preferencesValues: preferenceType[],
  devices: matchDeviceType[],
  deviceType: string,
  limit: number
): recommendedDevice[] {
  // Merge preference values with device values and normalize them
  const mergedValues = preferencesValuesToMergedValues(preferencesValues, devices)
  const normilizedValues = mergedValuesToNormilizedValues(mergedValues, deviceType)
  // Extract preference values and total device values, then calculate recommended devices
  const totalPrefsValues = normilizedValues.map((value) => value.prefValue)
  const totalDevicesValues = convertToTotalDevicesValues(normilizedValues)
  return calculateRecommendedDevices(totalDevicesValues, totalPrefsValues, limit)
}

// Function to get recommended devices based on a single device, device type, and all devices
export function getRecommendedDevices(
  device: matchDeviceType,
  deviceType: string,
  devices: matchDeviceType[]
) {
  // Extract preference values from the given device and calculate matched devices based on them
  const preferencesValues: preferenceType[] = []
  Object.keys(device).forEach((key) => {
    const property = key as keyof matchDeviceType
    if (property !== 'model' && device[property] !== null) {
      const value =
        property === 'releaseDate'
          ? new Date(device[property]).getFullYear()
          : device[property] ?? 0

      preferencesValues.push({
        name: property,
        value: value,
      })
    }
  })
  return getMatchedDevices(preferencesValues, devices, deviceType, recommendedDevicesLimit)
}

type preferenceType = {
  name: preprtiesSchemaType
  value: number
}

export function convertPreferencesToValues(
  preferences: preferenceType[],
  deviceType: string
): preferenceType[] {
  return preferences.map((pref) => {
    const weight = weights
      .find((val) => val.deviceType === deviceType)
      ?.weights.find((weight) => weight.name === pref.name)
    const minValue = weight?.minValue ?? 0
    const maxValue = weight?.maxValue ?? 0
    return {
      name: pref.name,
      value: getValueWithinRange(pref.value, minValue, maxValue),
    }
  })
}

type weights = {
  deviceType: string
  weights: weight[]
}

const weights: weights[] = deviceTypeProperties.map((value) => {
  return {
    deviceType: value.deviceType,
    weights: value.properties.map(
      (property) => weightsValues.find((weight) => weight.name === property) ?? weightsValues[0]
    ),
  }
})

type mergedValuesType = {
  name: preprtiesSchemaType
  prefValue: number
  devicesValues: {
    model: string
    value: number
  }[]
}[]

function preferencesValuesToMergedValues(
  preferencesValues: preferenceType[],
  devices: matchDeviceType[]
): mergedValuesType {
  return preferencesValues.map((pref) => {
    return {
      name: pref.name,
      prefValue: pref.value,
      devicesValues: devices.map((device) => {
        const value =
          pref.name === 'releaseDate'
            ? new Date(device[pref.name]).getFullYear()
            : device[pref.name] ?? 0
        return { model: device.model, value: value }
      }),
    }
  })
}

function mergedValuesToNormilizedValues(mergedValues: mergedValuesType, deviceType: string) {
  return mergedValues
    .filter((value) => {
      const weight = weights
        .find((val) => val.deviceType === deviceType)
        ?.weights.find((weight) => weight.name === value.name)
      return weight !== undefined
    })
    .map((value) => {
      const weight = weights
        .find((val) => val.deviceType === deviceType)
        ?.weights.find((weight) => weight.name === value.name)
      const minValue = weight?.minValue ?? 0
      const maxValue = weight?.maxValue ?? 0
      const devicesValues = value.devicesValues.map((value) => value.value)
      const prefValue = normalizeValue(value.prefValue, minValue, maxValue)
      const devicesNormalizedValues = devicesValues.map((deviceValue) =>
        normalizeValue(deviceValue, minValue, maxValue)
      )
      return {
        name: value.name,
        prefValue,
        devicesValues: value.devicesValues.map((device, index) => {
          return {
            model: device.model,
            value: devicesNormalizedValues[index],
          }
        }),
      }
    })
}

// Define the total devices type
type totalDevicesType = {
  model: string
  values: number[]
}

function convertToTotalDevicesValues(merged: mergedValuesType): totalDevicesType[] {
  const totalDevices: totalDevicesType[] = [] // Create an empty array to store the total devices
  const models = merged[0].devicesValues.map((device) => device.model) // Get the models from the first device
  models.forEach((model) => {
    const values: number[] = [] // Create an empty array to store the values
    merged.map((value) => {
      // Calculate the total value for each model and push it to the values array
      values.push(value.devicesValues.find((device) => device.model === model)?.value ?? 0)
    })
    totalDevices.push({ model: model, values: values }) // Push the model and values to the total devices array
  })
  return totalDevices
}

// Function to calculate a value within a specified range based on an index
function getValueWithinRange(index: number, min: number, max: number): number {
  const preferenceRange = 4 // Define the number of divisions in the range
  const step = (max - min) / (preferenceRange - 1) // Calculate the step value
  return min + (index - 1) * step // Calculate and return the value based on the index
}

// Function to normalize a value within a given range
function normalizeValue(value: number, minValue: number, maxValue: number) {
  return (value - minValue) / (maxValue - minValue) // Normalize the value and return it
}

// Function to calculate the match percentage between two arrays of values
function calculateMatch(prefValues: number[], deviceValue: number[]): number {
  let totalDifference = 0 // Initialize the total difference
  prefValues.forEach((prefValue, index) => {
    // Calculate the total difference between preference and device values
    totalDifference += Math.abs(prefValue - deviceValue[index])
  })
  return Math.max(0, 1 - totalDifference / prefValues.length) * 100 // Calculate and return the match percentage
}

// Function to calculate the recommended devices based on total device values, total preference values, and a limit
function calculateRecommendedDevices(
  totalDevicesValues: totalDevicesType[],
  totalPrefsValues: number[],
  limit: number
) {
  // Calculate the match percentage for each device, round it to two decimal places, and return the top devices based on the limit
  return totalDevicesValues
    .map((device) => ({
      model: device.model,
      match: parseFloat(calculateMatch(totalPrefsValues, device.values).toFixed(2)),
    }))
    .slice(0, limit)
}
