import { Dispatch, useEffect, useState } from 'react'

import { Button } from '@mantine/core'
import { CreateNotification } from '@/utils/utils'
import { devicePropertiesType } from '@/models/enums'
import { trpc } from '@/utils/client'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'

type props = {
  model: string
  modelPage?: boolean
  favoritesPage?: boolean
  setDevices?: Dispatch<React.SetStateAction<devicePropertiesType[] | undefined>>
}
export default function FavoritesButtons({ model, modelPage, favoritesPage, setDevices }: props) {
  const user = useUser() // Get the user object from Supabase
  const { t } = useTranslation('translations')
  const [isInList, setIsInList] = useState<boolean | undefined>(undefined)
  const { mutate: addToFavoritesMutation } = trpc.device.addToFavorites.useMutation()
  const { mutate: deleteFromFavoritesMutation } = trpc.device.deleteFromFavorites.useMutation()
  const { data } = trpc.device.isDeviceInUser.useQuery({
    email: user?.email,
    model: model,
  })

  useEffect(() => {
    if (data !== undefined) {
      setIsInList(data)
    }
  }, [data])

  function handleIsInlist(model: string, email: string, method: 'add' | 'remove') {
    if (method === 'add') {
      addToFavorites(model, email)
    } else if (method === 'remove') {
      deleteFromFavorites(model, email)
    }
  }
  function deleteFromFavorites(model: string, email: string) {
    setIsInList(undefined)
    deleteFromFavoritesMutation(
      { model, email },
      {
        onSuccess() {
          setIsInList(false)
          CreateNotification(t('removedFromFavorites'), 'green')
          if (favoritesPage && setDevices) {
            setDevices((prev) => prev?.filter((device) => device.model !== model))
          }
        },
      }
    )
  }
  function addToFavorites(model: string, email: string) {
    setIsInList(undefined)
    addToFavoritesMutation(
      { model, email },
      {
        onSuccess() {
          setIsInList(true)
          CreateNotification(t('addedToFavorites'), 'green')
        },
      }
    )
  }

  const email = user?.email

  if (!email) {
    return (
      <Button variant='light' color={'gray'} radius='md' size='md' disabled={true} fullWidth>
        {t('signInToAccess')}
      </Button>
    )
  }

  return (
    <>
      {favoritesPage ? (
        <Button
          variant='light'
          color={'red'}
          radius='md'
          size='md'
          disabled={isInList === undefined}
          onClick={() => deleteFromFavorites(model, email)}
          fullWidth>
          {isInList !== undefined ? t(modelPage ? 'removeFromFavorites' : 'remove') : t('loading')}
        </Button>
      ) : (
        <Button
          variant='light'
          color={isInList ? 'red' : 'green'}
          radius='md'
          size='md'
          disabled={isInList === undefined}
          onClick={() => handleIsInlist(model, email, isInList ? 'remove' : 'add')}
          fullWidth>
          {isInList !== undefined
            ? isInList === true
              ? t(modelPage ? 'removeFromFavorites' : 'remove')
              : t(modelPage ? 'addToFavorites' : 'add')
            : t('loading')}
        </Button>
      )}
    </>
  )
}
