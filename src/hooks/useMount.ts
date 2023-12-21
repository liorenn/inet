import { Cookies } from 'typescript-cookie'
import { useEffect } from 'react'
import { trpc } from '../misc/trpc'
import { useProfilePicture } from './useProfilePicture'
import { useUser } from '@supabase/auth-helpers-react'
import { encodeEmail } from '../misc/functions'

const useMount = () => {
  const user = useUser()
  const { setImageExists, setImagePath } = useProfilePicture()
  console.log('mounted')

  useEffect(() => {
    if (user?.email) {
      fetch(`/users/${encodeEmail(user.email)}.png`)
        .then((response) => {
          if (response.ok && user?.email) {
            setImageExists(true)
            setImagePath(`/users/${encodeEmail(user.email)}.png`)
          }
        })
        .catch((error) => {
          if (error) {
            setImageExists(false)
          }
        })
    } else {
      setImageExists(false)
    }
  }, [])
}

export default useMount
