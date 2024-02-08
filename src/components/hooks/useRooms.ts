import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"
import { RoomUser } from "../../interfaces/RoomUser"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addRooms } from "../../features/user/UserSlice"

export const useRooms = () => {
  const dispatch = useAppDispatch()
  const userRooms = useAppSelector(state => state.user.rooms)
  const [rooms, setRooms] = useState<RoomUser[]>([])
  const [error, setError] = useState('')

  const { loading, fetching } = useFetch(async() => {
    const storageUser = sessionStorage.getItem('user')

    if (typeof storageUser === 'string') {
      const parsedUser = JSON.parse(storageUser)
      
      const response = await fetch('http://localhost:5000/get-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedUser.rooms)
      })

      const data = await response.json()

      setRooms(data)
      dispatch(addRooms(data))
      sessionStorage.setItem('rooms', JSON.stringify(data))
    }
  }, setError)

  const updateRooms = () => {
    const storageRooms = sessionStorage.getItem('rooms')

    if (typeof storageRooms === 'string') {
      const parsedRooms = JSON.parse(storageRooms)

      if (parsedRooms.length !== 0) {
        setRooms(parsedRooms)
        dispatch(addRooms(parsedRooms))
      } else {
        fetching()
      }
    } else {
      fetching()
    }
  }

  useEffect(() => {
    updateRooms()
  }, [])

  useEffect(() => {
    if (userRooms.length > 0) {
      setRooms(userRooms)
    }
  }, [userRooms])

  return { rooms, loading, setRooms }
}