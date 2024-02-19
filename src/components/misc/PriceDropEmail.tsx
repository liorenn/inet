import { Body, Container, Head, Hr } from '@react-email/components'
import { Html, Link, Preview, Text } from '@react-email/components'

import { Device } from '@prisma/client'
import { clientEnv } from '@/utils/env'

/* eslint-disable react/no-unescaped-entities */

type PriceDropEmailProps = {
  name: string
  device: Device
  newPrice: number
  percentage: number
}

export default function PriceDropEmail({
  name,
  device,
  newPrice,
  percentage,
}: PriceDropEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {device.name} Price Drop! Now {percentage.toFixed(1)}% off - your wishlist item is calling!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={greeting}>Hi {name},</Text>
          <Text style={paragraph}>
            Great news! The price of the {device.name} you saved in your wishlist has dropped by{' '}
            <span style={priceDrop}>{percentage.toFixed(1)}%</span> Now, you can grab it for just
            the price of <span style={priceDrop}>{newPrice.toFixed(1)}$</span> instead of{' '}
            <span style={oldPrice}>{device.price.toFixed(1)}$</span> ! 🎉
          </Text>
          <Text style={paragraph}>Here's a reminder of why the {device.name} is amazing</Text>
          <ul style={list}>
            <li>Blazing fast {device.chipset} chip for seamless performance.</li>
            {device.screenSize && (
              <li>Stunning {device.screenSize} inches Super Retina XDR display.</li>
            )}
            {device.batterySize && (
              <li>{device.batterySize} MaH Battery for long lasting battery life.</li>
            )}
          </ul>
          <Text style={paragraph}>
            Don't miss out on this opportunity! Head over to{' '}
            <Link href={`${clientEnv.websiteUrl}/device/${device.type}/${device.model}`}>
              {device.name} Details
            </Link>{' '}
            now and make it yours before the offer ends. Act fast, as this special price is only
            available for a limited time!
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Best regards, INet Team</Text>
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

const greeting = {
  fontSize: '18px',
  fontWeight: 'bold',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
}

const list = {
  listStyleType: 'disc',
  paddingLeft: '20px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}

const priceDrop = {
  color: '#52c41a', // Green color for the price drop
  fontWeight: 'bold',
}
const oldPrice = {
  textDecoration: 'line-through',
  color: '#ff4d4f', // Red color for the old price
}
