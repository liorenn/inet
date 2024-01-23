import { Cookies } from 'typescript-cookie'
import { trpc } from '@/utils/client'
import { useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

const useAutoTrigger = () => {
  const user = useUser()
  const { mutate } = trpc.auth.sendPriceDropsEmail.useMutation()
  useEffect(() => {
    const existingCookie = Cookies.get('triggeredFunction')
    if (!existingCookie) {
      mutate({ email: user?.email })
      console.log('triggered function')
      Cookies.set('triggeredFunction', true, { expires: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default useAutoTrigger
