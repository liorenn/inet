import { IconArrowNarrowUp } from '@tabler/icons'
import { useWindowScroll } from '@mantine/hooks'
import { Affix, Button, Transition } from '@mantine/core'

function ScrollToTop() {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition='slide-up' mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              rightIcon={<IconArrowNarrowUp />}
              style={transitionStyles}
              color='gray'
              variant='filled'
              onClick={() => scrollTo({ y: 0 })}>
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  )
}

export default ScrollToTop
