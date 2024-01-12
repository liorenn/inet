import { SimpleGrid, Title } from '@mantine/core'

import DeviceCard from '@/components/device/DeviceCard'
import Loader from '@/components/layout/Loader'
import { trpc } from '@/server/client'

type props = { model: string; deviceType: string }

export default function RecommendedDevices({ model, deviceType }: props) {
  const { data } = trpc.device.getRecommendedDevices.useQuery({ model, deviceType })

  return (
    <>
      <Title mb='md'>Recommended Devices</Title>
      <SimpleGrid cols={3} mb={40}>
        {data ? (
          data.map((device, index) => (
            <DeviceCard
              key={index}
              device={excludeProperty(device, 'match')}
              matchPrecentage={device.match}
            />
          ))
        ) : (
          <Loader />
        )}
      </SimpleGrid>
    </>
  )
}

function excludeProperty<T, K extends keyof T>(obj: T, propKey: K): Omit<T, K> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [propKey]: _, ...rest } = obj
  return rest
}
