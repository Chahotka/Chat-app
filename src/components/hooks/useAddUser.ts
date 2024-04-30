import { useState } from "react"
import { useFetch } from "./useFetch"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { UserState, addRoom } from "../../features/user/UserSlice"
import { RoomUser } from "../../interfaces/RoomUser"
import { GroupUser } from "../../interfaces/GroupUser"

export const useAddUser = (
  searchText: string,
  searchBy: string
) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const [error, setError] = useState('')
  const storageRooms = sessionStorage.getItem('rooms')
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({creator: user.id, searchText, searchBy})
  }
  const checkDuplicate = () => {
    let duplicatedUser = user.rooms.filter(room => 
      room[searchBy as keyof (RoomUser | GroupUser)] === searchText.toLowerCase())

    if (duplicatedUser.length > 0 ) {
      return true
    }

    return false
  }

  const { fetching, loading } = useFetch(async () => {
    setError('')

    if (checkDuplicate()) {
      setError('You adready added this user')
      return
    } else if (user[searchBy as keyof UserState] === searchText.toLowerCase()) {
      setError(`You can't add yourself`)
      return
    }

    const response = await fetch('http://localhost:5000/add-user', fetchOptions)
    const data = await response.json()

    if (data.status === 'error') {
      setError(data.res)
      return
    } else if (data.status === 'success') {
      dispatch(addRoom(data.res))

      if (typeof storageRooms === 'string') {
        const rooms = JSON.parse(storageRooms)
        sessionStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('rooms', JSON.stringify([...rooms, data.res]))
      }
    }
  }, setError)


  return {fetching, loading, error}
}