import { IconCheck, IconExclamationMark, IconX } from '@tabler/icons-react'

import type { Comment } from '@prisma/client'
import type { ReactNode } from 'react'
import { rem } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

export type ActionResponse = {
  message: string
  error: boolean
}

const icons = [
  { color: 'red', icon: <IconX style={{ width: rem(18), height: rem(18) }} /> },
  { color: 'yellow', icon: <IconExclamationMark style={{ width: rem(18), height: rem(18) }} /> },
  { color: 'green', icon: <IconCheck style={{ width: rem(18), height: rem(18) }} /> }
]

// export function createNotification(response: ActionResponse) {
//   showNotification(response.message, response.error ? 'red' : 'green')
// }

export function createNotification(message: string, color: 'red' | 'green' | 'yellow') {
  const icon = icons.find((i) => i.color === color)?.icon

  return showNotification({
    title: message,
    message: '',
    color: color,
    autoClose: 6000,
    radius: 'md',
    icon: icon,
    style: { width: '70%', float: 'right' }
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

// Function to exclude a property from an object and return a new object without that property
export function excludeProperty<T, K extends keyof T>(obj: T, propKey: K): Omit<T, K> {
  const { [propKey]: _, ...rest } = obj // Destructuring the property to be excluded and the rest of the object
  return rest // Returning the new object without the excluded property
}

// Split array into array of arrays with length of size
export function chunkArray<T>(array: T[], size: number): T[][] {
  if (!array.length) return [] // If the array is empty return an empty array
  const head = array.slice(0, size) // Get the first size elements
  const tail = array.slice(size) // Get the rest of the elements
  return [head, ...chunkArray(tail, size)] // Recursively call the function with the rest of the elements
}
