import type { CamerasSpecsType, SpecsType } from '@/models/SpecsFormatter'
import { ColorSwatch, Grid, Group, Table, Text, Tooltip } from '@mantine/core'
import type { ColorsSpecsType, SpecDataType } from '@/models/SpecsFormatter'

import PriceText from '@/components/misc/PriceText'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = {
  specs: SpecsType
  name: string
}

export default function DeviceTable({ specs, name }: Props) {
  const { t } = useTranslation('main') // Get the translation function

  if (name === 'cameras') {
    specs = specs as CamerasSpecsType[]
    return (
      <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
        <tbody>
          {specs.map((element, index) => (
            <tr key={index}>
              <td>
                <Grid>
                  <Grid.Col span={6} sx={{ fontWeight: 600, fontSize: 20 }}>
                    <Text>{t(element.type)}</Text>
                  </Grid.Col>
                  <Grid.Col span={6} sx={{ fontWeight: 400, fontSize: 20 }}>
                    <Text>{`${element.megapixel} ${t('megapixelUnits')}`}</Text>
                  </Grid.Col>
                </Grid>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  } else {
    specs = specs as SpecDataType[] // Cast the specs to an array of SpecDataType
    return (
      <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
        <tbody>
          {specs.map((element, index) => {
            if (element.property === 'devicesColors') {
              element.value = element.value as ColorsSpecsType // Cast the value to a ColorsSpecsType
              return (
                <tr key={index}>
                  <td>
                    <Grid>
                      <Grid.Col span={6} sx={{ fontWeight: 600, fontSize: 20 }}>
                        <Text>{t(element.property)}</Text>
                      </Grid.Col>
                      <Grid.Col span={6} sx={{ fontWeight: 400, fontSize: 20 }}>
                        <Text>
                          <Group position='left' spacing='xs'>
                            {element.value.map((value, index) => (
                              <Tooltip
                                offset={10}
                                color='gray'
                                label={value.devicesColors.name}
                                key={index}>
                                <ColorSwatch color={value.devicesColors.hex} withShadow />
                              </Tooltip>
                            ))}
                          </Group>
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </td>
                </tr>
              )
            } else {
              element.value = element.value as string | null // Cast the value to a string or null
              if (element.property.toLowerCase().includes('price')) {
              }
              return (
                <tr key={index}>
                  <td>
                    <Grid>
                      <Grid.Col span={6} sx={{ fontWeight: 600, fontSize: 20 }}>
                        <Text>{t(element.property)}</Text>
                      </Grid.Col>
                      <Grid.Col span={6} sx={{ fontWeight: 400, fontSize: 20 }}>
                        <Text>
                          {element.property.toLowerCase().includes('price') ? (
                            element.value !== null ? (
                              <PriceText priceString={element.value} />
                            ) : (
                              t('none')
                            )
                          ) : element.property.toLowerCase() === 'connector' ||
                            element.property.toLowerCase() === 'biometrics' ? (
                            element.value !== null ? (
                              `${t(element.value)} ${t(`${element.property}Units`)}`
                            ) : (
                              t('none')
                            )
                          ) : element.value !== null ? (
                            `${element.value} ${t(`${element.property}Units`)}`
                          ) : (
                            t('none')
                          )}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </td>
                </tr>
              )
            }
          })}
        </tbody>
      </Table>
    )
  }
}
