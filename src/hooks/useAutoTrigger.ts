import { Cookies } from 'typescript-cookie'
import { useEffect } from 'react'
import { trpc } from '../misc/trpc'

const useAutoTrigger = () => {
  const { mutate } = trpc.auth.sendPriceDropsEmails.useMutation()
  useEffect(() => {
    const existingCookie = Cookies.get('triggeredFunction')
    if (!existingCookie) {
      mutate()
      console.log('triggered function')
      Cookies.set('triggeredFunction', true, { expires: 7 })
    }
  }, [mutate])
}

export default useAutoTrigger
