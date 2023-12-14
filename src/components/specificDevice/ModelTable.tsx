import { Table, Grid, Text, Group, Tooltip, ColorSwatch } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import PriceText from '../allDevices/PriceText'

type catergory = {
  label: string
  info: string
}
type TableProps = {
  category: catergory[]
  secondCatergory?: catergory[]
}

export default function ModelTable({ category, secondCatergory }: TableProps) {
  const { t } = useTranslation('devices')

  return (
    <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
      <tbody>
        {category &&
          category.map((element, index) => (
            <tr key={element.label}>
              <td>
                <Grid>
                  <Grid.Col
                    span={secondCatergory ? 4 : 6}
                    sx={{ fontWeight: 600, fontSize: 20 }}>
                    <Text>{element.label}</Text>
                  </Grid.Col>
                  <Grid.Col
                    span={secondCatergory ? 4 : 6}
                    sx={{ fontWeight: 400, fontSize: 20 }}>
                    <Text>
                      {element.label === t('colors') ? (
                        <Group position='left' spacing='xs'>
                          {element.info.split(' ').map(
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
                      ) : element.label === t('releasePrice') ||
                        element.label === t('price') ? (
                        <PriceText priceString={element.info} />
                      ) : (
                        element.info
                      )}
                    </Text>
                  </Grid.Col>
                  {secondCatergory && (
                    <Grid.Col span={4} sx={{ fontWeight: 400, fontSize: 20 }}>
                      <Text>
                        {secondCatergory[index].label === t('colors') ? (
                          <Group position='left' spacing='xs'>
                            {secondCatergory[index].info.split(' ').map(
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
                        ) : secondCatergory[index].label ===
                            t('releasePrice') ||
                          secondCatergory[index].label === t('price') ? (
                          <PriceText
                            priceString={secondCatergory[index].info}
                          />
                        ) : (
                          secondCatergory[index].info
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
