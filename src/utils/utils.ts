// Importing icons from the Tabler and React libraries

import { IconCheck, IconExclamationMark, IconX } from '@tabler/icons'

import type { Comment } from '@prisma/client' // Importing Comment type from Prisma client
import type { ReactElement } from 'react' // Importing ReactElement type from React
import { Translate } from 'next-translate' // Importing Translate component from next-translate
import { showNotification } from '@mantine/notifications' // Importing showNotification function from Mantine notifications

// Function to create a notification with a message, color, and optional mobile parameter
export function CreateNotification(
  message: string,
  color: 'red' | 'green' | 'yellow', // Color parameter can be red, green, or yellow
  mobile?: boolean // Optional mobile parameter
) {
  const icon: ReactElement | null = getIcon() // Initializing icon with the result of getIcon function

  // Function to get the appropriate icon based on the color
  function getIcon(): ReactElement | null {
    if (color === 'green') {
      return IconCheck({}) // Return green check icon
    } else if (color === 'yellow') {
      return IconExclamationMark({}) // Return yellow exclamation mark icon
    } else if (color === 'red') {
      return IconX({}) // Return red X icon
    }
    return IconExclamationMark({}) // Return default exclamation mark icon
  }

  // Showing the notification with the provided parameters
  return showNotification({
    title: message,
    message: '', // Empty message
    color: color,
    autoClose: 6000, // Auto close after 6 seconds
    radius: 'md', // Medium radius
    icon: icon,
    style: { width: '60%', float: 'right', marginBottom: mobile ? '40px' : '' }, // Dynamic style based on the mobile parameter
  })
}

// Function to calculate the average rating based on an array of comments
export function calculateAverageRating(comments: Comment[]) {
  let AverageRating = 0 // Initializing average rating
  if (comments.length === 0) return 0 // If there are no comments, return 0
  comments.forEach((comment) => {
    AverageRating += comment.rating // Summing up the ratings
  })
  AverageRating /= comments.length // Calculating the average rating
  return AverageRating // Returning the average rating
}

// Function to format the given release date to a string in the format "day/month/year"
export function FormatDate(releaseDate: Date): string {
  const date = new Date(releaseDate) // Creating a new date object
  const day = date.getUTCDate() // Getting the day
  const month = date.getMonth() + 1 // Getting the month (adding 1 as it's zero-based)
  const year = date.getFullYear() // Getting the year
  return `${day.toString()}/${month.toString()}/${year.toString()}` // Returning the formatted date string
}

// Function to calculate the percentage difference between two prices
export function calculatePercentageDiff(oldPrice: number, newPrice: number): number {
  if (oldPrice === 0) {
    return 0 // If the old price is 0, return 0 to avoid division by zero
  }
  const absoluteDifference = Math.abs(oldPrice - newPrice) // Calculating the absolute difference
  const percentageDifference = (absoluteDifference / oldPrice) * 100 // Calculating the percentage difference
  return percentageDifference // Returning the percentage difference
}

// Function to encode the given email using base64 encoding
export function encodeEmail(email: string) {
  return btoa(email) // Encoding the email using base64
}

// Function to translate the device name using the provided Translate component and name
export function translateDeviceName(t: Translate, name: string) {
  return name
    .split(' ')
    .map((word) => (Number.isNaN(parseFloat(word)) ? t(word.toLowerCase()) : word)) // Translating non-numeric words using the Translate component
    .join(' ')
}

// Function to exclude a property from an object and return a new object without that property
export function excludeProperty<T, K extends keyof T>(obj: T, propKey: K): Omit<T, K> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [propKey]: _, ...rest } = obj // Destructuring the property to be excluded and the rest of the object
  return rest // Returning the new object without the excluded property
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return []
  }
  const head = array.slice(0, size)
  const tail = array.slice(size)
  return [head, ...chunkArray(tail, size)]
}
