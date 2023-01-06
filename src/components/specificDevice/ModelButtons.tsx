import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

function ModelButtons() {
  const [isInList, toggleIsInList] = useDisclosure(false)

  function handleIsInlist() {
    toggleIsInList.toggle()
  }

  return (
    <Button
      variant='light'
      color={isInList ? 'red' : 'green'}
      radius='md'
      size='md'
      onClick={handleIsInlist}
      fullWidth>
      {isInList ? 'Remove From List' : 'Add To List'}
    </Button>
  )
}

export default ModelButtons
