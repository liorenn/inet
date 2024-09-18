import { MatchDeviceType, PropertiesSchemaType } from '@/models/deviceProperties'
import { Weight, deviceTypesProperties, weightsValues } from '@/models/deviceProperties'

type RecommendedDevice = {
  model: string
  match: number
}

// Function to get matched devices based on preference values, devices, device type, and limit
export function getMatchedDevices(
  preferencesValues: PreferenceType[],
  devices: MatchDeviceType[],
  deviceType: string,
  limit: number
): RecommendedDevice[] {
  // Merge preference values with device values and normalize them
  const mergedValues = preferencesValuesToMergedValues(preferencesValues, devices)
  const normilizedValues = mergedValuesToNormilizedValues(mergedValues, deviceType)
  // Extract preference values and total device values and then calculate recommended devices
  const totalPrefsValues = normilizedValues.map((value) => value.prefValue) // Get preferences values
  const totalDevicesValues = convertToTotalDevicesValues(normilizedValues) // Get total device values
  return calculateRecommendedDevices(totalDevicesValues, totalPrefsValues, limit) // Return the recommended devices
}

// Function to get recommended devices
export function getRecommendedDevices(
  device: MatchDeviceType,
  deviceType: string,
  devices: MatchDeviceType[],
  recommendedDevicesLimit: number = 6
) {
  const preferencesValues: PreferenceType[] = [] // Initialize the preference values array
  // Get the properties from the device
  Object.keys(device).forEach((key) => {
    const property = key as keyof MatchDeviceType // Cast the key to the type of the property
    // If property is not model and the property value is not null
    if (property !== 'model' && device[property] !== null) {
      const value =
        property === 'releaseDate' // If property is release date
          ? new Date(device[property]).getFullYear() // Get the year of the release date
          : device[property] ?? 0 // Else get the property value and else set it to zero
      // Add the preference value to the preferences values array
      preferencesValues.push({
        name: property,
        value: value,
      })
    }
  })
  return getMatchedDevices(preferencesValues, devices, deviceType, recommendedDevicesLimit) // Return the recommended devices
}

type PreferenceType = {
  name: PropertiesSchemaType
  value: number
}

export function convertPreferencesToValues(
  preferences: PreferenceType[],
  deviceType: string
): PreferenceType[] {
  return preferences.map((pref) => {
    const weight = weights
      .find((val) => val.deviceType === deviceType)
      ?.weights?.find((weight) => weight.property === pref.name)
    const minValue = weight?.minValue ?? 0
    const maxValue = weight?.maxValue ?? 0
    return {
      name: pref.name,
      value: getValueWithinRange(pref.value, minValue, maxValue),
    }
  })
}

type Weights = {
  deviceType: string
  weights: Weight[]
}

const weights: Weights[] = deviceTypesProperties.map((value) => {
  return {
    deviceType: value.deviceType,
    weights:
      value.properties.map(
        (property) =>
          weightsValues
            .find((deviceTypeWeight) => deviceTypeWeight.deviceType === value.deviceType)
            ?.weights?.find((weight) => weight.property === property) ?? weightsValues[0].weights[0]
      ) ?? weightsValues[0].weights[0],
  }
})

type MergedValuesType = {
  name: PropertiesSchemaType
  prefValue: number
  devicesValues: {
    model: string
    value: number
  }[]
}[]

// Function to convert preference values and devices values to merged values
function preferencesValuesToMergedValues(
  preferencesValues: PreferenceType[],
  devices: MatchDeviceType[]
): MergedValuesType {
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

// Function to convert the merged values to normalized values
function mergedValuesToNormilizedValues(mergedValues: MergedValuesType, deviceType: string) {
  return mergedValues
    .filter((value) => {
      const weight = weights
        .find((val) => val.deviceType === deviceType) // Get the weight of the device type
        ?.weights?.find((weight) => weight.property === value.name) // Find the weight of the property
      return weight !== undefined // Keep in the array if the weight exists
    })
    .map((value) => {
      const weight = weights
        .find((val) => val.deviceType === deviceType) // Get the weight of the device type
        ?.weights?.find((weight) => weight.property === value.name) // Find the weight of the property
      const minValue = weight?.minValue ?? 0 // Get the minimum value of the value
      const maxValue = weight?.maxValue ?? 0 // Get the maximum value of the value
      const devicesValues = value.devicesValues.map((value) => value.value) // Get the device values
      const prefValue = normalizeValue(value.prefValue, minValue, maxValue) // Get the normalized preference value
      const devicesNormalizedValues = devicesValues.map(
        (deviceValue) => normalizeValue(deviceValue, minValue, maxValue) // Get the normalized device values
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
type TotalDevicesType = {
  model: string
  values: number[]
}

// Function to convert the merged values into an array
function convertToTotalDevicesValues(merged: MergedValuesType): TotalDevicesType[] {
  const totalDevices: TotalDevicesType[] = [] // Create an empty array to store the total devices
  const models = merged[0].devicesValues.map((device) => device.model) // Get the models from the first device
  models.forEach((model) => {
    const values: number[] = [] // Create an empty array to store the values
    merged.map((value) => {
      // Calculate the total value for each model and push it to the values array
      values.push(value.devicesValues.find((device) => device.model === model)?.value ?? 0)
    })
    totalDevices.push({ model: model, values: values }) // Push the model and values to the total devices array
  })
  return totalDevices // Return the total devices
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
  totalDevicesValues: TotalDevicesType[],
  totalPrefsValues: number[],
  limit: number
) {
  // Calculate the match percentage for each device, round it to two decimal places, and return the top devices based on the limit
  return (
    totalDevicesValues
      // For each device in the total
      .map((device) => ({
        model: device.model,
        match: parseFloat(calculateMatch(totalPrefsValues, device.values).toFixed(2)), // Calculate the match percentage for device
      }))
      .sort((a, b) => b.match - a.match) // Sort the devices based on the match percentage
      .slice(0, limit) // Return the top devices based on the limit amount
  )
}
