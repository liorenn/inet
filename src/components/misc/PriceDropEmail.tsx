import { Body, Container, Head, Hr } from '@react-email/components'
import { Html, Link, Preview, Text } from '@react-email/components'

import { Device } from '@prisma/client'
import { clientEnv } from '@/utils/env'

/* eslint-disable react/no-unescaped-entities */

type PriceDropEmailProps = {
  name: string
  device: Device
  newPrice: number
  precentage: number
}

export default function PriceDropEmail({
  name,
  device,
  newPrice,
  precentage,
}: PriceDropEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {device.name} Price Drop! Now {precentage.toFixed(1)}% off - your wishlist item is calling!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Hi {name}</Text>
          <Text style={paragraph}>
            remember that awesome {device.name} you saved to your wishlist a while back? Well, get
            ready for some good news! The price just took a dip, and now it's even more
            irresistible. That's right! You can now snag the {device.name} for {newPrice} $ which is
            a sweet {precentage.toFixed(1)}% saving off the original price of {device.price}. Here's
            a quick reminder of what makes this phone so incredible: Stunning {device.screenSize}{' '}
            inches Super Retina XDR display: Immerse yourself in vibrant colors and razor sharp
            details. Blazing-fast {device.chipset} Bionic chip: Power through even the most
            demanding tasks with ease. Don't miss out on this chance to finally get your hands on
            the {device.name} at an amazing price. This offer won't last forever, so head over to{' '}
            <Link href={`${clientEnv.websiteUrl}/device/${device.type}/${device.model}`}>
              Click me
            </Link>{' '}
            now and make it yours! But hurry! This price drop is only for a limited time. We can't
            wait to see you rocking your new {device.name}.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>INet</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}
