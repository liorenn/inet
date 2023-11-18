import { IconArrowUp } from '@tabler/icons'
import { useOs, useWindowScroll } from '@mantine/hooks'
import { Affix, Button, Transition } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'

export default function ScrollToTop() {
  const os = useOs()
  const [scroll, scrollTo] = useWindowScroll()
  const { t } = useTranslation('common')

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
