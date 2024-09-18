import { Dispatch, useEffect, useState } from 'react'

import { Button } from '@mantine/core'
import { DevicePropertiesType } from '@/models/schemas'
import { api } from '@/lib/trpc'
import { createNotification } from '@/lib/utils'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = {
  model: string
  modelPage?: boolean
  favoritesPage?: boolean
  setDevices?: Dispatch<React.SetStateAction<DevicePropertiesType[] | undefined>>
}
export default function FavoritesButtons({ model, modelPage, favoritesPage, setDevices }: Props) {
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const email = user?.email // Get the user email from the user
  const { t } = useTranslation('main') // Get the translation function
  const [isInList, setIsInList] = useState<boolean | undefined>(undefined) // State variable to store if the device is in the user favorites
  const addToFavoritesMutation = api.device.addToFavorites.useMutation() // Add to favorites mutation
  const deleteFromFavoritesMutation = api.device.deleteFromFavorites.useMutation() // Delete from favorites mutation
  const isDeviceInUserMutation = api.device.isDeviceInUser.useQuery({
    email: user?.email,
    model: model
  }) // Check if the device is in the user favorites devices mutation

  // When the is device in user mutation data changes
  useEffect(() => {
    // Check if the data exists
    if (isDeviceInUserMutation.data !== undefined) {
      setIsInList(isDeviceInUserMutation.data) // Set the state variable
    }
  }, [isDeviceInUserMutation.data])

  // Handle add to favorites and delete from favorites
  function handleIsInlist(model: string, email: string, method: 'add' | 'remove') {
    // If the method is add
    if (method === 'add') {
      addToFavorites(model, email) // Add device to favorites
    }
    // If the method is remove
    else if (method === 'remove') {
      deleteFromFavorites(model, email) // Delete device from favorites
    }
  }

  // Handle add to favorites and delete from favorites
  function deleteFromFavorites(model: string, email: string) {
    setIsInList(undefined) // Set the state variable to undefined
    // Delete from favorites
    deleteFromFavoritesMutation.mutate(
      { model, email },
      {
        // On operation success
        onSuccess() {
          setIsInList(false) // Set the state variable to false
          createNotification(t('removedFromFavorites'), 'green') // Create a success notification
          // If the favorites page and setDevices exist
          if (favoritesPage && setDevices) {
            setDevices((prev) => prev?.filter((device) => device.model !== model)) // Delete the device from the list
          }
        }
      }
    )
  }

  // Add device to favorites
  function addToFavorites(model: string, email: string) {
    setIsInList(undefined) // Set the state variable to undefined
    // Add to favorites
    addToFavoritesMutation.mutate(
      { model, email },
      {
        // On operation success
        onSuccess() {
          setIsInList(true) // Set the state variable to true
          createNotification(t('addedToFavorites'), 'green') // Create a success notification
        }
      }
    ) // Add device to favorites
  }

  // If the user is not signed in
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
