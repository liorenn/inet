import { iphoneType } from '../../../utils/deviceTypes'
import { FormatDate } from '../../../utils/functions'
import { categoriesType } from '../ModelSpecs'

export const accordionContents = [
  'Display',
  'Battery',
  'Hardware',
  'Cameras',
  'Features',
  'Availability',
]

export default function GetIphoneSpecs(device: iphoneType): categoriesType {
  const cameras = []
  for (let i = 0; i < device.cameras.length; i++) {
    cameras.push({
      label: device.cameras[i].cameraType,
      info: device.cameras[i].megapixel + ' MP',
    })
  }
  const categories: categoriesType = [
    {
      name: 'Display',
      values: [
        { label: 'Screen Size', info: device.screenSize + ' inches' }, //, ref: refs[1]
        { label: 'Screen Type', info: device.screenType },
      ],
    },
    {
      name: 'Battery',
      values: [
        { label: 'Battery Size', info: device.batterySize + ' mAh' }, //, ref: refs[2]
        { label: 'Wired Charging', info: device.wiredCharging + ' W' },
        { label: 'Wireless Charging', info: device.wirelessCharging + ' W' },
      ],
    },
    {
      name: 'Hardware',
      values: [
        { label: 'Weight', info: device.weight + ' g' },
        { label: 'Chipset', info: device.chipset }, //, ref: refs[3]
        { label: 'Memory', info: device.memory + 'GB RAM' },
        { label: 'Storage', info: device.storage + ' GB' },
        { label: 'Operating System', info: 'iOS ' + device.operatingSystem },
      ],
    },
    {
      name: 'Cameras',
      values: cameras,
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
          info: device.colors
            .map((value) => value.Color.hex + '/' + value.Color.name)
            .join(' '),
        },
      ],
    },
  ]
  return categories
}
