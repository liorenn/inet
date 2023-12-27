import { Table, Grid, Text, Group, Tooltip, ColorSwatch } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import PriceText from '../misc/PriceText'
import { Device } from '@prisma/client'
import { deviceSpecsType } from '../../models/SpecsFormatter'

type catergory = {
  property: keyof deviceSpecsType
  value: string
}
type TableProps = {
  category: catergory[]
  secondCatergory?: catergory[]
}

export default function DeviceTable({ category, secondCatergory }: TableProps) {
  const { t } = useTranslation('translations')

  return (
    <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
      <tbody>
        {category &&
          category.map((element, index) => (
            <tr key={element.property}>
              <td>
                <Grid>
                  <Grid.Col
                    span={secondCatergory ? 4 : 6}
                    sx={{ fontWeight: 600, fontSize: 20 }}>
                    <Text>{t(element.property)}</Text>
                  </Grid.Col>
                  <Grid.Col
                    span={secondCatergory ? 4 : 6}
                    sx={{ fontWeight: 400, fontSize: 20 }}>
                    <Text>
                      {element.property === 'colors' ? (
                        <Group position='left' spacing='xs'>
                          {element.value.split(' ').map(
                            (color, index) =>
                              color !== undefined && (
                                <Tooltip
                                  offset={10}
                                  color='gray'
                                  label={color.split('/')[1]}
                                  key={index}>
                                  <ColorSwatch
                                    color={color.split('/')[0]}
                                    withShadow
                                  />
                                </Tooltip>
                              )
                          )}
                        </Group>
                      ) : element.property === 'releasePrice' ||
                        element.property === 'price' ? (
                        <PriceText priceString={element.value} />
                      ) : (
                        element.value
                      )}
                    </Text>
                  </Grid.Col>
                  {secondCatergory && (
                    <Grid.Col span={4} sx={{ fontWeight: 400, fontSize: 20 }}>
                      <Text>
                        {secondCatergory[index].property === 'colors' ? (
                          <Group position='left' spacing='xs'>
                            {secondCatergory[index].value.split(' ').map(
                              (color, index) =>
                                color !== undefined && (
                                  <Tooltip
                                    offset={10}
                                    color='gray'
                                    label={color.split('/')[1]}
                                    key={index}>
                                    <ColorSwatch
                                      color={color.split('/')[0]}
                                      withShadow
                                    />
                                  </Tooltip>
                                )
                            )}
                          </Group>
                        ) : secondCatergory[index].property ===
                            t('releasePrice') ||
                          secondCatergory[index].property === 'price' ? (
                          <PriceText
                            priceString={secondCatergory[index].value}
                          />
                        ) : (
                          secondCatergory[index].value
                        )}
                      </Text>
                    </Grid.Col>
                  )}
                </Grid>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  )
}
