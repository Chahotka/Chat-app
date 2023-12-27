import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { UserState, addRoom } from "../../features/user/UserSlice"
import { RoomUser } from "../../interfaces/RoomUser"

export const useAddUser = (
  searchText: string,
  searchBy: string
) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const [error, setError] = useState('')
  const storageRooms = localStorage.getItem('rooms')
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({creator: user.id, searchText, searchBy})
  }
  const checkDuplicate = () => {
    let duplicatedUser = user.rooms.filter(room => 
      room[searchBy as keyof RoomUser] === searchText.toLowerCase())

    if (duplicatedUser.length > 0 ) {
      return true
    }

    return false
  }

  const { fetching, loading } = useFetch(async () => {
    setError('')

    if (searchText.length < 4) {
      setError(`User ${searchBy} too short`)
      return
    } else if (checkDuplicate()) {
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
        localStorage.setItem('rooms', JSON.stringify([...rooms, data.res]))
      }
    }
  }, setError)


  return {fetching, loading, error}
}