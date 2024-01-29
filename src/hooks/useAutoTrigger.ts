import { Cookies } from 'typescript-cookie'
import { adminAccessKey } from 'config'
import { trpc } from '@/utils/client'
import { useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

// Define a custom hook to trigger a specific action
export default function useAutoTrigger() {
  const user = useUser() // Get the user object from Supabase // Get the user object from Supabase
  // Get the mutate function from the trpc client for sending price drop emails
  const sendEmailMutation = trpc.auth.sendPriceDropsEmail.useMutation()
  const sendEmailsMutation = trpc.auth.sendPriceDropsEmails.useMutation()
  const fetchDevicesPricesMutation = trpc.device.fetchDevicesPrices.useMutation()
  const backupDatabaseMutation = trpc.auth.backupDatabase.useMutation() // The backup mutation
  const accessKeyQuery = trpc.auth.getAccessKey.useQuery({ email: user?.email })

  useEffect(() => {
    // Use the useEffect hook to perform side effects
    if (accessKeyQuery.data && accessKeyQuery.data >= adminAccessKey) {
      const existingCookie = Cookies.get('triggeredAdminFunction') // Check if the triggeredFunction cookie exists
      if (!existingCookie) {
        // If the cookie doesn't exist, trigger the action and set the cookie
        sendEmailsMutation.mutate({}) // Trigger the action
        backupDatabaseMutation.mutate()
        fetchDevicesPricesMutation.mutate()
        Cookies.set('triggeredAdminFunction', true, { expires: 3 }) // Set the cookie to prevent repeated triggering
      }
    } else {
      const existingCookie = Cookies.get('triggeredFunction') // Check if the triggeredFunction cookie exists
      if (!existingCookie) {
        // If the cookie doesn't exist, trigger the action and set the cookie
        sendEmailMutation.mutate({ email: user?.email }) // Trigger the action
        Cookies.set('triggeredFunction', true, { expires: 1 }) // Set the cookie to prevent repeated triggering
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // The empty dependency array ensures that the effect runs only once when the component mounts
}
