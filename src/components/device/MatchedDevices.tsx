import { Divider, SimpleGrid, Title } from '@mantine/core'

import DeviceCard from '@/components/device/DeviceCard'
import Loader from '@/components/layout/Loader'
import { devicePropertiesType } from '@/models/enums'
import { excludeProperty } from '@/utils/utils'

type props = {
  title: string
  isLoading: boolean
  data: (devicePropertiesType & { match: number })[] | undefined
}

export default function MatchedDevices({ title, data, isLoading }: props) {
  return (
    <>
      {data && (
        <>
          <Title>{title}</Title>
          <Divider sx={{ marginBottom: 10 }} />
        </>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        data && (
          <SimpleGrid cols={2} mb={40}>
            {data.map((device, index) => (
              <DeviceCard
                key={index}
                device={excludeProperty(device, 'match')}
                matchPrecentage={device.match}
              />
            ))}
          </SimpleGrid>
        )
      )}
    </>
  )
}
