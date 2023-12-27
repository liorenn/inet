import type { CameraType, Device } from '@prisma/client'
import type { categoriesType } from '../components/device/DevicesSpecs'
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
  const { t } = useTranslation('translations')

  const cameras: { property: 'cameras'; value: string }[] = []
  if (device.cameras) {
    device.cameras.forEach((camera) => {
      cameras.push({
        property: t(camera.type.toString()),
        value: `${camera.megapixel.toString()} ${t('mp')}`,
      })
    })
  }

  const categories: categoriesType = [
    {
      name: '',
      specs: [
        {
          property: t('screenSize'),
          value: device.screenSize
            ? `${device.screenSize.toString()} ${t('screenSizeUnits')}`
            : t('none'),
        },
        {
          property: t('screenType'),
          value: device.screenType ? device.screenType.toString() : t('none'),
        },
      ],
    },
    {
      name: t('battery'),
      specs: [
        {
          property: t('batterySize'),
          value: device.batterySize
            ? `${device.batterySize.toString()} ${t('batterySizeUnits')}`
            : t('none'),
        },
      ],
    },
    {
      name: t('hardware'),
      specs: [
        { property: t('chipset'), value: device.chipset },
        {
          property: t('memory'),
          value: device.memory
            ? `${device.memory.toString()} ${t('memoryUnits')}`
            : t('none'),
        },
        {
          property: t('storage'),
          value: device.storage
            ? `${device.storage.toString()}  ${t('storageUnits')}`
            : t('none'),
        },
        {
          property: t('operatingSystem'),
          value: device.releaseOS ? device.releaseOS : t('none'),
        },
        {
          property: t('weight'),
          value: `${device.weight.toString()} ${t('weightUnits')}`,
        },
        {
          property: t('height'),
          value: `${device.height.toString()} ${t('heightUnits')}`,
        },
        {
          property: t('width'),
          value: `${device.width.toString()} ${t('widthUnits')}`,
        },
        {
          property: t('depth'),
          value: `${device.depth.toString()} ${t('depthUnits')}`,
        },
      ],
    },
    {
      name: 'camera',
      specs:
        cameras.length > 0
          ? cameras
          : [{ property: 'cameras', value: t('none') }],
    },
    {
      name: t('features'),
      specs: [
        {
          property: t('biometrics'),
          value: device.biometrics ? device.biometrics : t('none'),
        },
        {
          property: t('resistance'),
          value: device.resistanceRating ? device.resistanceRating : t('none'),
        },
      ],
    },
    {
      name: t('availability'),
      specs: [
        {
          property: t('releasePrice'),
          value: device.releasePrice.toString(),
        },
        {
          property: t('releaseDate'),
          value: FormatDate(device.releaseDate),
        },
        {
          property: t('colors'),
          value: device.colors
            ? device.colors
                .map(
                  (value) =>
                    `${value.color.hex}/${value.color.name.replace(/\s/g, '')}`
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
        category.specs.unshift({
          property: t('price'),
          value: device.price.toString(),
        })
    })
  }

  return categories
}
