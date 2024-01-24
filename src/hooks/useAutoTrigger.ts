import { Cookies } from 'typescript-cookie'
import { trpc } from '@/utils/client'
import { useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

// Define a custom hook to trigger a specific action
export default function useAutoTrigger() {
  const user =
    useUser()() // Get the user object from Supabase // Get the user object from Supabase
  // Get the mutate function from the trpc client for sending price drop emails
  const { mutate } = trpc.auth.sendPriceDropsEmail.useMutation()
  useEffect(() => {
    // Use the useEffect hook to perform side effects
    const existingCookie = Cookies.get('triggeredFunction') // Check if the triggeredFunction cookie exists
    if (!existingCookie) {
      // If the cookie doesn't exist, trigger the action and set the cookie
      mutate({ email: user?.email }) // Trigger the action
      console.log('triggered function') // Log the action
      Cookies.set('triggeredFunction', true, { expires: 1 }) // Set the cookie to prevent repeated triggering
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // The empty dependency array ensures that the effect runs only once when the component mounts
}
