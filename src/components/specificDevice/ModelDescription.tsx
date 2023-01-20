import { Title, Spoiler, Text, Group, Rating, Button } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { Device } from '@prisma/client'
import { IconArrowDown } from '@tabler/icons'

type Props = {
  device: Device
  commentsAmout: number
  ratingValue: number
}

function ModelDescription({ device, commentsAmout, ratingValue }: Props) {
  const [scroll, scrollTo] = useWindowScroll()
  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  // function GetModelRting() {
  //   if (model.comments === null || model.comments === undefined) {
  //     return 0
  //   }
  //   let sum = 0
  //   for (let i = 0; i < model.comments.length; i++) {
  //     sum += model.comments[i].rating
  //   }
  //   return sum / model.comments.length / 10 / 2
  // }

  // const handleRating = (rate) => {
  //   setRating(rate)
  // }

  return (
    <>
      <Group>
        <Button
          variant='light'
          color='gray'
          leftIcon={<IconArrowDown size={16} />}
          onClick={() => scrollTo({ y: 2700 })}>
          go to comments
        </Button>
        <Text size='xl' weight={600}>
          {commentsAmout} Comments
        </Text>
        <Rating value={ratingValue} fractions={2} readOnly />
      </Group>

      <Title
        order={2}
        sx={{
          borderBottom: dark ? '1px solid #666666' : '1px solid #dee2e6',
        }}>
        Description
      </Title>
      <Spoiler maxHeight={100} showLabel='Show more' hideLabel='Hide'>
        <Text size='xl' weight={500}>
          {device.description}
        </Text>
      </Spoiler>
    </>
  )
}

export default ModelDescription
