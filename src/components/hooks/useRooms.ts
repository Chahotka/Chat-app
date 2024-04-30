import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"
import { RoomUser } from "../../interfaces/RoomUser"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addRooms } from "../../features/user/UserSlice"
import { socket } from "../../socket/socket"
import { Message } from "../../interfaces/Message"
import { GroupUser } from "../../interfaces/GroupUser"

export const useRooms = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const [rooms, setRooms] = useState<(RoomUser | GroupUser)[]>([])
  const [error, setError] = useState('')

  const { loading, fetching } = useFetch(async () => {
    const storageUser = sessionStorage.getItem('user')

    if (typeof storageUser === 'string') {
      const parsedUser = JSON.parse(storageUser)
      console.log(parsedUser)

      const response = await fetch('http://localhost:5000/get-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedUser.rooms)
      })

      const data: (RoomUser | GroupUser)[] = await response.json()

      console.log(data)

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

  const joinRooms = () => {
    const storedUser = sessionStorage.getItem('user')

    if (typeof storedUser === 'string') {
      const parsedRooms: RoomUser[] = JSON.parse(storedUser).rooms || []
      const roomIds = parsedRooms.map(room => room.roomId)

      socket.emit('join rooms', roomIds)
    }
  }

  useEffect(() => {
    updateRooms()
    joinRooms()
  }, [])

  useEffect(() => {
    if (user.rooms.length > 0) {
      setRooms(user.rooms)
    }
  }, [user.rooms])

  return { rooms, loading, setRooms }
}