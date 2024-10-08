import { Divider, SimpleGrid, Title } from '@mantine/core'

import DeviceCard from '@/components/device/DeviceCard'
import { DevicePropertiesType } from '@/models/schemas'
import Loader from '@/components/layout/Loader'
import { excludeProperty } from '@/lib/utils'

// The component props
type Props = {
  title: string
  isLoading: boolean
  data: (DevicePropertiesType & { match: number })[] | undefined
}

export default function MatchedDevices({ title, data, isLoading }: Props) {
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
          <SimpleGrid
            breakpoints={[
              { minWidth: 400, cols: 1 },
              { minWidth: 800, cols: 2 },
              { minWidth: 'lg', cols: 3 }
            ]}
            mb={40}>
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
