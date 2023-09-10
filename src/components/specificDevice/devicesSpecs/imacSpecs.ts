import useTranslation from 'next-translate/useTranslation'
import type { imacType } from '../../../utils/deviceTypes'
import { FormatDate } from '../../../utils/functions'
import type { categoriesType } from '../ModelSpecs'

export const accordionContents = [
  'Display',
  'Hardware',
  'Cameras',
  'Features',
  'Availability',
]

export default function GetImacSpecs(device: imacType): categoriesType {
  const { t } = useTranslation('devices')
  const categories: categoriesType = [
    {
      name: t('display'),
      values: [
        {
          label: t('screenSize'),
          info: device.screenSize.toString() + ' ' + t('inches'),
        }, //, ref: refs[1]
      ],
    },
    {
      name: t('hardware'),
      values: [
        { label: t('weight'), info: device.weight.toString() + ' g' },
        { label: t('chipset'), info: device.chipset }, //, ref: refs[3]
        {
          label: t('memory'),
          info: device.unifiedMemory.toString() + 'GB RAM',
        },
        { label: t('storage'), info: device.storage.toString() + ' GB' },
        {
          label: t('operatingSystem'),
          info: 'iOS ' + device.operatingSystem.toString(),
        },
      ],
    },
    {
      name: t('cameras'),
      values: [
        {
          label: t('mainCamera'),
          info: device.cameras[0]
            ? t(device.cameras[0].cameraType.toString()) +
              ' ' +
              device.cameras[0].megapixel.toString() +
              ' ' +
              t('mp')
            : t('none'),
        },
      ],
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
        { label: t('price'), info: device.releasePrice.toString() + '$' }, //, ref: refs[5]
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
