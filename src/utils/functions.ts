import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX, IconExclamationMark } from '@tabler/icons'
import type { ReactElement } from 'react'
import type { Comment } from '@prisma/client'
import { deviceType } from './deviceTypes'

/**
 * Capitalizes first letters of words in string.
 * @param {string} str String to be modified
 * @param {boolean=false} lower Whether all other letters should be lowercased
 * @return {string}
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
 */
// const capitalize = (str: string, lower = false) =>
//   (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
//     match.toUpperCase()
//   )
/**
 * Formats the given release date into a string representation.
 *
 * @param {Date} releaseDate - The release date to be formatted.
 * @return {string} The formatted date string in the format "day/month/year".
 */
export function FormatDate(releaseDate: Date): string {
  const date = new Date(releaseDate)
  const day = date.getUTCDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return day.toString() + '/' + month.toString() + '/' + year.toString()
}

/**
 * Creates a notification with the specified message and color.
 *
 * @param {string} message - The message to display in the notification.
 * @param {'red' | 'green' | 'yellow'} color - The color of the notification.
 * @return {void} The created notification.
 */
export function CreateNotification(
  message: string,
  color: 'red' | 'green' | 'yellow'
) {
  const icon: ReactElement | null = getIcon()

  function getIcon(): ReactElement | null {
    if (color === 'green') {
      return IconCheck({})
    } else if (color === 'yellow') {
      return IconExclamationMark({})
    } else if (color === 'red') {
      return IconX({})
    }
    return IconExclamationMark({})
  }

  return showNotification({
    title: message,
    message: '',
    color: color,
    autoClose: 6000,
    radius: 'md',
    icon: icon,
    style: {
      width: '60%',
      float: 'right',
    },
  })
}

/**
 * Returns the device type based on the given device model.
 *
 * @param {string} deviceModel - The device model to determine the type for.
 * @return {string} The device type.
 */
export function getDeviceType(deviceModel: string) {
  const devicesTypes = Object.getOwnPropertyNames(deviceType)
  for (let i = 0; i < devicesTypes.length; i++) {
    if (deviceModel.includes(devicesTypes[i]) && devicesTypes[i] !== 'mac') {
      //because imac and macbook contain the word mac so it would always return mac
      return devicesTypes[i]
    }
  }
  return 'unknown'
}

/**
 * Calculates the average rating based on an array of comments.
 *
 * @param {Comment[]} comments - The array of comments.
 * @return {number} The average rating.
 */
export function CalcAverageRating(comments: Comment[]) {
  let AverageRating = 0
  for (let i = 0; i < comments.length; i++) {
    AverageRating += comments[i].Rating
  }
  AverageRating /= comments.length
  return AverageRating
}
