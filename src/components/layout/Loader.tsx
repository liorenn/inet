import { Center } from '@mantine/core'
import { Loader as MantineLoader } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
export default function Loader() {
  const { height } = useViewportSize()
  return (
    <>
      <Center>
        <MantineLoader color='gray' size={120} variant='dots' mt={height / 3} />
      </Center>
    </>
  )
}
