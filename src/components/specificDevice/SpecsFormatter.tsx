import { Device } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'
import { categoriesType } from './ModelSpecs'
import { FormatDate } from '../../utils/functions'

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
        Color: {
          name: string
          hex: string
        }
      }[]
    } & Device

export default function FortmatSpecs(device: deviceSpecsType) {
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
        {
          label: t('wiredCharging'),
          info: device.wiredCharging
            ? device.wiredCharging?.toString() + ' ' + t('wiredChargingUnits')
            : t('none'),
        },
        {
          label: t('wirelessCharging'),
          info: device.wirelessCharging
            ? device.wirelessCharging?.toString() + ' ' + t('wiredCharging')
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
          info: device.releaseOS ? 'iOS ' + device.releaseOS : t('none'),
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
          info: device.releasePrice.toString() + t('releasePriceUnits'),
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
                    value.Color.hex + '/' + value.Color.name.replace(/\s/g, '')
                )
                .join(' ')
            : t('none'),
        },
      ],
    },
  ]
  return categories
}
