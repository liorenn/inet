import { trpc } from '../utils/trpc'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { Device, DeviceTypeValue } from '@prisma/client'
import ModelLayout from '../components/specificDevice/ModelLayout'
import { Button, Center, Container, Loader } from '@mantine/core'
import ModelHeader from '../components/specificDevice/ModelHeader'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import { useState } from 'react'
import React from 'react'
import ModelsSpecs from '../components/specificDevice/ModelsSpecs'

export default function compare() {
  const { height } = useViewportSize()
  const deviceQuery1 = trpc.UniqueDevice.getiPhone.useQuery({
    model: 'iphone12',
  })
  const deviceQuery2 = trpc.UniqueDevice.getiPhone.useQuery({
    model: 'iphonexs',
  })
  const device1 = deviceQuery1.data as Device
  const device2 = deviceQuery2.data as Device

  if (device1 === undefined || device2 === undefined) {
    return (
      <>
        <Head>
          <title>compare</title>
        </Head>
        <Center>
          <Loader color='gray' size={120} variant='dots' mt={height / 3} />
        </Center>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>compare</title>
      </Head>
      <Container size='lg'>
        <ModelsSpecs device1={device1} device2={device2} />
      </Container>
    </>
  )
}
