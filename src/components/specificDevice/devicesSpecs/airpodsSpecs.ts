import useTranslation from 'next-translate/useTranslation'
import type { airpodsType } from '../../../utils/deviceTypes'
import { FormatDate } from '../../../utils/functions'
import type { categoriesType } from '../ModelSpecs'

export const accordionContents = [
  'Sound Features',
  'Battery',
  'Hardware',
  'Features',
  'Availability',
]

export default function GetAirpodsSpecs(device: airpodsType): categoriesType {
  const { t } = useTranslation('devices')
  const soundFeatures = []
  for (let i = 0; i < device.features.length; i++) {
    soundFeatures.push({
      label: t(device.features[i]),
      info: t('exist'),
    })
  }
  const categories: categoriesType = [
    {
      name: t('soundFeatures'),
      values: soundFeatures,
    },
    {
      name: t('battery'),
      values: [
        {
          label: t('batterySize'),
          info: device.batterySize.toString() + ' mAh',
        },
      ],
    },
    {
      name: t('hardware'),
      values: [
        { label: t('weight'), info: device.weight.toString() + ' g' },
        { label: t('chipset'), info: device.chipset },
        {
          label: t('operatingSystem'),
          info: 'iOS ' + device.operatingSystem.toString(),
        },
      ],
    },
    {
      name: t('features'),
      values: [
        { label: t('case'), info: device.case },
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
