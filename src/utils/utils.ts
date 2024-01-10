import { IconCheck, IconExclamationMark, IconX } from '@tabler/icons'

import type { Comment } from '@prisma/client'
import type { ReactElement } from 'react'
import { Translate } from 'next-translate'
import { showNotification } from '@mantine/notifications'

export function CreateNotification(
  message: string,
  color: 'red' | 'green' | 'yellow',
  mobile?: boolean
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
    style: { width: '60%', float: 'right', marginBottom: mobile ? '40px' : '' },
  })
}

export function calculateAverageRating(comments: Comment[]) {
  let AverageRating = 0
  if (comments.length === 0) return 0
  comments.forEach((comment) => {
    AverageRating += comment.rating
  })
  AverageRating /= comments.length
  return AverageRating
}

export function FormatDate(releaseDate: Date): string {
  const date = new Date(releaseDate)
  const day = date.getUTCDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${day.toString()}/${month.toString()}/${year.toString()}`
}

export function calculatePercentageDiff(oldPrice: number, newPrice: number): number {
  if (oldPrice === 0) {
    return 0
  }
  const absoluteDifference = Math.abs(oldPrice - newPrice)
  const percentageDifference = (absoluteDifference / oldPrice) * 100
  return percentageDifference
}

export function encodeEmail(email: string) {
  return btoa(email)
}

export function translateDeviceName(t: Translate, name: string) {
  return name
    .split(' ')
    .map((word) => (Number.isNaN(parseFloat(word)) ? t(word.toLowerCase()) : word))
    .join(' ')
}
