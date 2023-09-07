import useTranslation from 'next-translate/useTranslation'
import { iphoneType } from '../../../utils/deviceTypes'
import { FormatDate } from '../../../utils/functions'
import { categoriesType } from '../ModelSpecs'

type returnType = {
  categories: categoriesType
  accordionContents: string[]
}

export const accordionContents = [
  'display',
  'battery',
  'hardware',
  'cameras',
  'features',
  'availability',
]

export default function GetIphoneSpecs(device: iphoneType) {
  const { t } = useTranslation('devices')
  const cameras = []
  for (let i = 0; i < device.cameras.length; i++) {
    cameras.push({
      label: t(device.cameras[i].cameraType),
      info: device.cameras[i].megapixel + ' ' + t('mp'),
    })
  }
  const categories: categoriesType = [
    {
      name: t('display'),
      values: [
        { label: t('screenSize'), info: device.screenSize + ' ' + t('inches') },
        { label: t('screenType'), info: device.screenType },
      ],
    },
    {
      name: t('battery'),
      values: [
        { label: t('batterySize'), info: device.batterySize + ' mAh' },
        {
          label: t('wiredCharging'),
          info: device.wiredCharging + ' ' + t('watt'),
        },
        {
          label: t('wirelessCharging'),
          info: device.wirelessCharging + ' ' + t('watt'),
        },
      ],
    },
    {
      name: t('hardware'),
      values: [
        { label: t('weight'), info: device.weight + ' g' },
        { label: t('chipset'), info: device.chipset },
        { label: t('memory'), info: device.memory + 'GB RAM' },
        { label: t('storage'), info: device.storage + ' GB' },
        { label: t('operatingSystem'), info: 'iOS ' + device.operatingSystem },
      ],
    },
    {
      name: t('cameras'),
      values: cameras,
    },
    {
      name: t('features'),
      values: [
        { label: t('biometrics'), info: device.biometrics.replace('_', ' ') },
        {
          label: t('resistance'),
          info: device.resistance ? device.resistance.join(' ') : t('none'),
        },
      ],
    },
    {
      name: t('availability'),
      values: [
        { label: t('price'), info: device.releasePrice + '$' },
        {
          label: t('releaseDate'),
          info: FormatDate(device.releaseDate),
        },
        {
          label: t('colors'),
          info: device.colors
            .map((value) => value.Color.hex + '/' + value.Color.name)
            .join(' '),
        },
      ],
    },
  ]
  return categories
}
