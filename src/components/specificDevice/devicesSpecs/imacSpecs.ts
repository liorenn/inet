import { imacType, iphoneType } from '../../../utils/deviceTypes'
import { FormatDate } from '../../../utils/functions'
import { categoriesType } from '../ModelSpecs'

export const accordionContents = [
  'Display',
  'Hardware',
  'Cameras',
  'Features',
  'Availability',
]

export default function GetImacSpecs(device: imacType): categoriesType {
  const categories: categoriesType = [
    {
      name: 'Display',
      values: [
        { label: 'Screen Size', info: device.screenSize + ' inches' }, //, ref: refs[1]
      ],
    },
    {
      name: 'Hardware',
      values: [
        { label: 'Weight', info: device.weight + ' g' },
        { label: 'Chipset', info: device.chipset }, //, ref: refs[3]
        { label: 'Memory', info: device.unifiedMemory + 'GB RAM' },
        { label: 'Storage', info: device.storage + ' GB' },
        { label: 'Operating System', info: 'iOS ' + device.operatingSystem },
      ],
    },
    {
      name: 'Cameras',
      values: [
        {
          label: 'Main Camera',
          info: device.cameras[0]
            ? device.cameras[0].cameraType +
              ' ' +
              device.cameras[0].megapixel +
              ' MP'
            : 'None',
        },
      ],
    },
    {
      name: 'Features',
      values: [
        { label: 'Biometrics', info: device.biometrics.replace('_', ' ') },
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
