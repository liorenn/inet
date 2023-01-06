import { Title, Spoiler, Text, Group } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'
import { Device } from '@prisma/client'

type Props = {
  device: Device
  // scrolls: any
}

function ModelDescription({ device }: Props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
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
      {/* <Group>
        <Text size='xl' weight={600}>
          {model.name} Rating
        </Text>
        {model.comments !== null && (
          <Rating initialValue={rating} transition allowHalfIcon />
        )}
        {model.comments !== null ? (
          <Text size='xl' weight={600}>
            {model.comments !== null && model.comments !== undefined
              ? model.comments.length
              : 0}{' '}
            Comments
          </Text>
        ) : (
          <Text size='xl' weight={600}>
            0 Comments
          </Text>
        )}
      </Group> */}
      <Text size='xl' weight={600}>
        0 Comments
      </Text>

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
