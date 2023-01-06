import { airpodsType, iphoneType } from '../../../utils/deviceTypes'
import { FormatDate } from '../../../utils/functions'
import { categoriesType } from '../ModelSpecs'

export const accordionContents = [
  'Sound Features',
  'Battery',
  'Hardware',
  'Features',
  'Availability',
]

export default function GetAirpodsSpecs(device: airpodsType): categoriesType {
  const soundFeatures = []
  for (let i = 0; i < device.features.length; i++) {
    soundFeatures.push({
      label: device.features[i],
      info: 'Exists',
    })
  }
  const categories: categoriesType = [
    {
      name: 'Sound Features',
      values: soundFeatures,
    },
    {
      name: 'Battery',
      values: [
        { label: 'Battery Size', info: device.batterySize + ' mAh' }, //, ref: refs[2]
      ],
    },
    {
      name: 'Hardware',
      values: [
        { label: 'Weight', info: device.weight + ' g' },
        { label: 'Chipset', info: device.chipset }, //, ref: refs[3]
        { label: 'Operating System', info: 'iOS ' + device.operatingSystem },
      ],
    },
    {
      name: 'Features',
      values: [
        { label: 'Case', info: device.case },
        { label: 'Biometrics', info: device.biometrics },
        {
          label: 'Resistance',
          info: device.resistance ? device.resistance.join(' ') : 'none',
        },
      ],
    },
    {
      name: 'Availability',
      values: [
        { label: 'Price', info: device.releasePrice + '$' }, //, ref: refs[5]
        {
          label: 'Release Date',
          info: FormatDate(device.releaseDate),
        },
        {
          label: 'Colors',
          info: device.colors.map((value) => value.Color.name).join(' '),
        },
      ],
    },
  ]
  return categories
}
