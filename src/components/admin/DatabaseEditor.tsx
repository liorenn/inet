import { managerAccessKey } from 'config'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// The component props
type Props = {
  accessKey: number // The user access key
}

export default function DatabaseEditor({ accessKey }: Props) {
  const router = useRouter() // Get the router

  useEffect(() => {
    if (accessKey && accessKey < managerAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/') // If the access key is less than the manager access key redirect to the home page
    }
  }, [accessKey, router])

  return (
    <>
      <iframe
        title='Database Editor'
        width='100%'
        height='760px'
        frameBorder='0'
        src={`http://localhost:5555/`}></iframe>
    </>
  )
}
