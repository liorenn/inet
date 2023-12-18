import type { Device } from '@prisma/client'
import type { categoriesType } from '../components/device/DeviceSpecs'
import { FormatDate } from '../misc/functions'
import useTranslation from 'next-translate/useTranslation'

export const accordionContents = [
  'display',
  'battery',
  'hardware',
  'cameras',
  'features',
  'availability',
]

export type deviceSpecsType =
  | {
      cameras: {
        type: string
        megapixel: number
      }[]
      colors: {
        color: {
          name: string
          hex: string
        }
      }[]
    } & Device

export function FortmatSpecs(device: deviceSpecsType) {
  const { t } = useTranslation('devices')

  const cameras = []
  if (device.cameras) {
    for (let i = 0; i < device.cameras.length; i++) {
      cameras.push({
        label: t(device.cameras[i].type.toString()),
        info: device.cameras[i].megapixel.toString() + ' ' + t('mp'),
      })
    }
  }

  const categories: categoriesType = [
    {
      name: t('display'),
      values: [
        {
          label: t('screenSize'),
          info: device.screenSize
            ? device.screenSize.toString() + ' ' + t('screenSizeUnits')
            : t('none'),
        },
        {
          label: t('screenType'),
          info: device.screenType ? device.screenType.toString() : t('none'),
        },
      ],
    },
    {
      name: t('battery'),
      values: [
        {
          label: t('batterySize'),
          info: device.batterySize
            ? device.batterySize.toString() + ' ' + t('batterySizeUnits')
            : t('none'),
        },
      ],
    },
    {
      name: t('hardware'),
      values: [
        { label: t('chipset'), info: device.chipset },
        {
          label: t('memory'),
          info: device.memory
            ? device.memory.toString() + ' ' + t('memoryUnits')
            : t('none'),
        },
        {
          label: t('storage'),
          info: device.storage
            ? device.storage.toString() + ' ' + t('storageUnits')
            : t('none'),
        },
        {
          label: t('operatingSystem'),
          info: device.releaseOS ? device.releaseOS : t('none'),
        },
        {
          label: t('weight'),
          info: device.weight.toString() + ' ' + t('weightUnits'),
        },
        {
          label: t('height'),
          info: device.height.toString() + ' ' + t('heightUnits'),
        },
        {
          label: t('width'),
          info: device.width.toString() + ' ' + t('widthUnits'),
        },
        {
          label: t('depth'),
          info: device.depth.toString() + ' ' + t('depthUnits'),
        },
      ],
    },
    {
      name: t('cameras'),
      values: cameras.length > 0 ? cameras : t('none'),
    },
    {
      name: t('features'),
      values: [
        {
          label: t('biometrics'),
          info: device.biometrics ? device.biometrics : t('none'),
        },
        {
          label: t('resistance'),
          info: device.resistanceRating ? device.resistanceRating : t('none'),
        },
      ],
    },
    {
      name: t('availability'),
      values: [
        {
          label: t('releasePrice'),
          info: device.releasePrice.toString(),
        },
        {
          label: t('releaseDate'),
          info: FormatDate(device.releaseDate),
        },
        {
          label: t('colors'),
          info: device.colors
            ? device.colors
                .map(
                  (value) =>
                    value.color.hex + '/' + value.color.name.replace(/\s/g, '')
                )
                .join(' ')
            : t('none'),
        },
      ],
    },
  ]

  if (device.price !== 0) {
    categories.map((category) => {
      category.name === t('availability') &&
        category.values.unshift({
          label: t('price'),
          info: device.price.toString(),
        })
    })
  }

  return categories
}
