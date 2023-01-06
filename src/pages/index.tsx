import Head from 'next/head'
import { Grid, Button, Text, Title, Image } from '@mantine/core'
import { Group, Stack, Container } from '@mantine/core'

export default function home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container size={1600} px={10}>
        <Grid sx={{ marginTop: 70 }}>
          <Grid.Col xl={5}>
            <Stack sx={{ marginTop: 110, marginLeft: 100 }} spacing='xl'>
              <Title size={48}>Inet</Title>
              <Text size={28}>
                Compare between different apple devices
                <br />
                View devices information and specifications
                <br />
                Find the apple device that matches you
                <br />
                hello world
              </Text>
              <Group>
                <Button color='gray' variant='light' size='lg' radius='md'>
                  Find Your Device
                </Button>
                <Button color='gray' variant='light' size='lg' radius='md'>
                  Compare Devices
                </Button>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col xl={7}>
            {/* <Spline
              scene='https://prod.spline.design/6Bg4l7N6w0UWWQqk/scene.splinecode'
              width={1160}
            /> */}
            <Image
              src={'/images/commercial/iphone_gallery_4.png'}
              fit='contain'
            />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}
