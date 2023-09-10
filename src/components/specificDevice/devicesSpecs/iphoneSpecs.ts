import useTranslation from 'next-translate/useTranslation'
import type { iphoneType } from '../../../utils/deviceTypes'
import { FormatDate } from '../../../utils/functions'
import type { categoriesType } from '../ModelSpecs'

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
      label: t(device.cameras[i].cameraType.toString()),
      info: device.cameras[i].megapixel.toString() + ' ' + t('mp'),
    })
  }
  const categories: categoriesType = [
    {
      name: t('display'),
      values: [
        {
          label: t('screenSize'),
          info: device.screenSize.toString() + ' ' + t('inches'),
        },
        { label: t('screenType'), info: device.screenType.toString() },
      ],
    },
    {
      name: t('battery'),
      values: [
        {
          label: t('batterySize'),
          info: device.batterySize.toString() + ' mAh',
        },
        {
          label: t('wiredCharging'),
          info: device.wiredCharging.toString() + ' ' + t('watt'),
        },
        {
          label: t('wirelessCharging'),
          info: device.wirelessCharging.toString() + ' ' + t('watt'),
        },
      ],
    },
    {
      name: t('hardware'),
      values: [
        { label: t('weight'), info: device.weight.toString() + ' g' },
        { label: t('chipset'), info: device.chipset },
        { label: t('memory'), info: device.memory.toString() + 'GB RAM' },
        { label: t('storage'), info: device.storage.toString() + ' GB' },
        {
          label: t('operatingSystem'),
          info: 'iOS ' + device.operatingSystem.toString(),
        },
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
        { label: t('price'), info: device.releasePrice.toString() + '$' },
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
