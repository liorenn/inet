import { ColorSwatch, Grid, Group, Table, Text, Tooltip } from '@mantine/core'
import type { ColorsSpecsType, MergedCameraType } from '@/models/SpecsFormatter'
import type { SpecsArrayType, SpecsDataType } from '@/models/SpecsFormatter'

import PriceText from '@/components/misc/PriceText'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  name: string
  specs: SpecsArrayType
}

export default function DevicesTable({ specs, name }: Props) {
  const { t } = useTranslation('translations')

  if (name === 'cameras') {
    specs = specs as MergedCameraType[]
    return (
      <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
        <tbody>
          {specs.map((element, index) => (
            <tr key={`a${index}`}>
              <td>
                <Grid columns={60}>
                  <Grid.Col
                    span={60 / (element.megapixels.length + 1)}
                    sx={{ fontWeight: 600, fontSize: 20 }}>
                    <Text>{t(element.type)}</Text>
                  </Grid.Col>
                  {Array.from({ length: element.megapixels.length }).map((_, index) => {
                    const megapixel = element.megapixels[index]
                    return (
                      <Grid.Col
                        key={`b${index}`}
                        span={60 / (element.megapixels.length + 1)}
                        sx={{ fontWeight: 400, fontSize: 20 }}>
                        <Text>
                          {megapixel !== null ? `${megapixel} ${t('megapixelUnits')}` : t('none')}
                        </Text>
                      </Grid.Col>
                    )
                  })}
                </Grid>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  } else {
    specs = specs as SpecsDataType
    return (
      <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
        <tbody>
          {specs.map((element, index) => {
            if (element.property === 'colors') {
              element.values = element.values as ColorsSpecsType[]
              return (
                <tr key={`c${index}`}>
                  <td>
                    <Grid columns={60}>
                      <Grid.Col
                        span={60 / (element.values.length + 1)}
                        sx={{ fontWeight: 600, fontSize: 20 }}>
                        <Text>{t(element.property)}</Text>
                      </Grid.Col>
                      {element.values.map((value, index) => (
                        <Grid.Col
                          span={60 / (element.values.length + 1)}
                          key={`d${index}`}
                          sx={{ fontWeight: 400, fontSize: 20 }}>
                          <Group>
                            {value.map((color, index) => (
                              <Tooltip
                                offset={10}
                                color='gray'
                                label={color.color.name}
                                key={`e${index}`}>
                                <ColorSwatch color={color.color.hex} withShadow />
                              </Tooltip>
                            ))}
                          </Group>
                        </Grid.Col>
                      ))}
                    </Grid>
                  </td>
                </tr>
              )
            } else {
              element.values = element.values as (string | null)[]
              return (
                <tr key={`f${index}`}>
                  <td>
                    <Grid columns={60}>
                      <Grid.Col
                        span={60 / (element.values.length + 1)}
                        sx={{ fontWeight: 600, fontSize: 20 }}>
                        <Text>{t(element.property)}</Text>
                      </Grid.Col>
                      {element.values.map((value, index) => (
                        <Grid.Col
                          span={60 / (element.values.length + 1)}
                          key={`g${index}`}
                          sx={{ fontWeight: 400, fontSize: 20 }}>
                          <Text>
                            {value === null ? (
                              t('none')
                            ) : element.property.toLowerCase().includes('price') ? (
                              <PriceText priceString={value} />
                            ) : (
                              `${value} ${t(`${element.property}Units`)}`
                            )}
                          </Text>
                        </Grid.Col>
                      ))}
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
