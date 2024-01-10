import { Device } from '@prisma/client'

type weightValueType = {
  name: string
  minValue: number
  maxValue: number
}

const preferenceRange = 4 //from 0 to value
export type preferenceType = {
  name: matchProperty
  value: number
}

const weightsValues: weightValueType[] = [
  { name: 'screenSize', minValue: 5, maxValue: 6.7 },
  { name: 'batterySize', minValue: 2800, maxValue: 3400 },
  { name: 'price', minValue: 600, maxValue: 1200 },
  { name: 'memory', minValue: 8, maxValue: 64 },
  { name: 'cpu', minValue: 2, maxValue: 8 },
  { name: 'gpu', minValue: 2, maxValue: 8 },
  { name: 'weight', minValue: 2, maxValue: 8 },
  { name: 'storage', minValue: 8, maxValue: 64 },
]

export type matchDeviceType = Pick<
  Device,
  'model' | 'screenSize' | 'batterySize' | 'price' | 'storage' | 'memory' | 'weight' | 'cpu' | 'gpu'
>
type matchProperty = keyof Omit<matchDeviceType, 'model'>

export type recommendedDevice = {
  model: string
  match: number
}

type mergedValuesType = {
  name: matchProperty
  prefValue: number
  devicesValues: {
    model: string
    value: number
  }[]
}[]

export function getRelatedDevices(device: matchDeviceType, devices: matchDeviceType[]) {
  const preferencesValues: preferenceType[] = []
  Object.keys(device).forEach((key) => {
    const property = key as keyof matchDeviceType
    if (property !== 'model' && device[property] !== null) {
      preferencesValues.push({
        name: property,
        value: device[property] as number,
      })
    }
  })
  return getMatchedDevices(preferencesValues, devices)
}

export function getMatchedDevices(
  preferencesValues: preferenceType[],
  devices: matchDeviceType[]
): recommendedDevice[] {
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
    console.log(value.name)
    const minValue = weightsValues.find((weight) => weight.name === value.name)?.minValue ?? 0
    const maxValue = weightsValues.find((weight) => weight.name === value.name)?.maxValue ?? 0
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
  const totalPrefsValues = normilizedValues.map((value) => value.prefValue)
  const totalDevicesValues: totalDevicesType[] = convertToTotalDevicesValues(normilizedValues)
  const recommendedDevices = totalDevicesValues.map((device) => ({
    model: device.model,
    match: parseFloat(calculateMatch(totalPrefsValues, device.values).toFixed(2)),
  }))
  return recommendedDevices
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

export function convertPreferencesToValues(preferences: preferenceType[]): preferenceType[] {
  return preferences.map((pref) => {
    return {
      name: pref.name,
      value: getValueWithinRange(
        pref.value,
        weightsValues.find((value) => value.name === pref.name)?.minValue ?? 0,
        weightsValues.find((value) => value.name === pref.name)?.maxValue ?? 0
      ),
    }
  })
}

function getValueWithinRange(index: number, min: number, max: number): number {
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

// const devicesData: matchDeviceType[] = [
//   ...Array(6)
//     .fill(null)
//     .map(() => ({
//       model: `Device ${Math.floor(Math.random() * 100) + 1}`, // Unique model name
//       screenSize: getRandomValueFromOptions([5, 8]),
//       batterySize: getRandomValueFromOptions([3800, 5000]),
//       price: getRandomValueFromOptions([600, 1300]),
//       storage: 16,
//       memory: 8,
//       weight: 2,
//       cpu: null,
//       gpu: null,
//     })),
// ]
// function getRandomValueFromOptions(range: number[]) {
//   const min = Math.min(...range)
//   const max = Math.max(...range)
//   const randomValue = Math.random() * (max - min + 1) + min
//   return parseFloat(randomValue.toFixed(1))
// }
