import { Affix, Button, Transition } from '@mantine/core'
import { useOs, useWindowScroll } from '@mantine/hooks'

import { IconArrowUp } from '@tabler/icons-react'
import useTranslation from 'next-translate/useTranslation'

export default function ScrollToTop() {
  const os = useOs() // Get the client operating system
  const { t } = useTranslation('main') // Get the translation function
  const [scroll, scrollTo] = useWindowScroll() // Get scroll function

  return (
    <>
      {os !== 'ios' ? (
        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition transition='slide-up' mounted={scroll.y > 100}>
            {(transitionStyles) => (
              <Button
                variant='light'
                color='gray'
                leftIcon={<IconArrowUp size={16} />}
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}>
                {t('scrollToTop')}
              </Button>
            )}
          </Transition>
        </Affix>
      ) : (
        ''
      )}
    </>
  )
}
