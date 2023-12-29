import { Table, Grid, Text, Group, Tooltip, ColorSwatch } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import PriceText from '../misc/PriceText'
import type {
  camerasSpecsType,
  colorsSpecsType,
  specDataType,
  specsType,
} from '../../models/SpecsFormatter'

type TableProps = {
  specs: specsType
  name: string
}

export default function DeviceTable({ specs, name }: TableProps) {
  const { t } = useTranslation('translations')

  if (name === 'cameras') {
    specs = specs as camerasSpecsType[]
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
    specs = specs as specDataType[]
    return (
      <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
        <tbody>
          {specs.map((element, index) => {
            if (element.property === 'colors') {
              element.value = element.value as colorsSpecsType
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
                                label={value.color.name}
                                key={index}>
                                <ColorSwatch
                                  color={value.color.hex}
                                  withShadow
                                />
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
              element.value = element.value as string | null
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
