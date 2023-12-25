import { useState } from "react"
import { useFetch } from "./useFetch"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addRoom } from "../../features/user/UserSlice"
import { RoomUser } from "../../interfaces/RoomUser"

export const useAddUser = (
  searchText: string,
  searchBy: string
) => {
  const dispatch = useAppDispatch()
  const rooms = useAppSelector(state => state.user.rooms)
  const [error, setError] = useState('')
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({searchText, searchBy})
  }

  const checkDuplicate = () => {
    let duplicatedUser = rooms.filter(room => 
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
    }



    const response = await fetch('http://localhost:5000/search-user', fetchOptions)
    const data = await response.json()

    if (data.status === 'error') {
      setError(data.res)
      return
    } else if (data.status === 'success') {
      dispatch(addRoom(data.res))
    }
  }, setError)


  return {fetching, loading, error}
}