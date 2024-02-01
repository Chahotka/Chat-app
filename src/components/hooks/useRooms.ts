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
    const user = sessionStorage.getItem('user')

    if (typeof user === 'string') {
      const parsedUser = JSON.parse(user)
      
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


  useEffect(() => {
    if (rooms.length === 0) {
      const userRooms = sessionStorage.getItem('rooms')

      if (typeof userRooms === 'string') {
        const rooms: RoomUser[] = JSON.parse(userRooms)

        if (rooms.length === 0) {
          fetching()
        } else {
          setRooms(rooms)
        }
      } else if (!sessionStorage.getItem('rooms')){
        fetching()
      }
    } else {
      setRooms(prev => [...prev, ...userRooms])
    }
  }, [userRooms])

  return { rooms, loading }
}