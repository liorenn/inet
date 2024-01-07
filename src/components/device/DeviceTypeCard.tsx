import { Card, Button, Image } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

type props = {
  devicesType: string
}

export default function DeviceTypeCard({ devicesType }: props) {
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
