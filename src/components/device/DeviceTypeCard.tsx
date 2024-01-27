import { Button, Card, Image } from '@mantine/core'

import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = {
  devicesType: string
}

export default function DeviceTypeCard({ devicesType }: Props) {
  const { t } = useTranslation('translations')

  return (
    <Card key={devicesType}>
      <Card.Section>
        <Image
          src={`/images/devices/${devicesType}.png`}
          height={220}
          fit={'contain'}
          alt='device photo'
        />
      </Card.Section>
      <Link href={`/device/${devicesType}`} style={{ textDecoration: 'none' }}>
        <Button variant='light' color='gray' fullWidth mt='md' radius='md'>
          {t(devicesType)}
        </Button>
      </Link>
    </Card>
  )
}
