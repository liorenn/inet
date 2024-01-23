import { deviceTypeProperties, weight, weightsValues } from '@/models/deviceProperties'
import { matchDeviceType, preprtiesSchemaType } from '@/models/schemas'

import { recommendedDevicesLimit } from 'config'

type recommendedDevice = {
  model: string
  match: number
}

export function getMatchedDevices(
  preferencesValues: preferenceType[],
  devices: matchDeviceType[],
  deviceType: string,
  limit: number
): recommendedDevice[] {
  const mergedValues = preferencesValuesToMergedValues(preferencesValues, devices)
  const normilizedValues = mergedValuesToNormilizedValues(mergedValues, deviceType)
  const totalPrefsValues = normilizedValues.map((value) => value.prefValue)
  const totalDevicesValues = convertToTotalDevicesValues(normilizedValues)
  return calculateRecommendedDevices(totalDevicesValues, totalPrefsValues, limit)
}

export function getRecommendedDevices(
  device: matchDeviceType,
  deviceType: string,
  devices: matchDeviceType[]
) {
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

type totalDevicesType = {
  model: string
  values: number[]
}

function convertToTotalDevicesValues(merged: mergedValuesType): totalDevicesType[] {
  const totalDevices: totalDevicesType[] = []
  const models = merged[0].devicesValues.map((device) => device.model)
  models.forEach((model) => {
    const values: number[] = []
    merged.map((value) => {
      values.push(value.devicesValues.find((device) => device.model === model)?.value ?? 0)
    })
    totalDevices.push({ model: model, values: values })
  })
  return totalDevices
}

function getValueWithinRange(index: number, min: number, max: number): number {
  const preferenceRange = 4
  const step = (max - min) / (preferenceRange - 1)
  return min + (index - 1) * step
}

function normalizeValue(value: number, minValue: number, maxValue: number) {
  return (value - minValue) / (maxValue - minValue)
}

function calculateMatch(prefValues: number[], deviceValue: number[]): number {
  let totalDifference = 0
  prefValues.forEach((prefValue, index) => {
    totalDifference += Math.abs(prefValue - deviceValue[index])
  })
  return Math.max(0, 1 - totalDifference / prefValues.length) * 100
}

function calculateRecommendedDevices(
  totalDevicesValues: totalDevicesType[],
  totalPrefsValues: number[],
  limit: number
) {
  return totalDevicesValues
    .map((device) => ({
      model: device.model,
      match: parseFloat(calculateMatch(totalPrefsValues, device.values).toFixed(2)),
    }))
    .slice(0, limit)
}
