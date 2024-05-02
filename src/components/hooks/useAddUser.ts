import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { UserState, addRoom } from "../../features/user/UserSlice"
import { RoomUser } from "../../interfaces/RoomUser"
import { GroupUser } from "../../interfaces/GroupUser"


const fetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
}

export const useAddUser = (
  searchText: string,
  searchBy: string
) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)

  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  const storageRooms = sessionStorage.getItem('rooms')

  const checkSearchText = () => {
    let duplicatedUser = user.rooms.filter(room => 
      room[searchBy as keyof (RoomUser | GroupUser)] === searchText.toLowerCase())

    if (duplicatedUser.length > 0 ) {
      setError('You already added this user')
      setShowError(true)
      return true
    }
    if (user[searchBy as keyof UserState] === searchText.toLowerCase()) {
      setError(`You can't add yourself`)
      setShowError(true)
      return true
    }
    if (searchText.length < 6) {
      setError('Id or Email is too short')
      setShowError(true)
      return true
    }

    return false
  }

  const { fetching, loading } = useFetch(async () => {
    setError('')

    if (checkSearchText()) return


    const response = await fetch('http://localhost:5000/add-user', {
      ...fetchOptions,
      body: JSON.stringify({creator: user.id, searchText, searchBy})
    })
    const data = await response.json()

    if (data.status === 'error') {
      setError(data.res)
      setShowError(true)
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

  useEffect(() => {
    setShowError(false)
  }, [searchText])


  return {fetching, loading, error, showError}
}