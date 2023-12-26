import React, { useEffect, useState } from 'react'
import cl from '../styles/rooms.module.css'
import { RoomUser } from '../interfaces/RoomUser'
import Room from './Rooms/Room'
import Sidebar from './Rooms/Sidebar'
import { useFilter } from './hooks/useFilter'
import AddRoom from './Rooms/AddRoom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addRoom } from '../features/user/UserSlice'

interface Props {
  users: RoomUser[]
}

const Rooms: React.FC<Props> = ({ users }) => {
  const dispatch = useAppDispatch()
  const rooms = useAppSelector(state => state.user.rooms)
  const [name, setName] = useState('')
  const { filteredUsers } = useFilter(name, users)

  useEffect(() => {
    if (rooms.length === 0) {
      const storageRooms = localStorage.getItem('rooms')

      if (typeof storageRooms === 'string') {
        const parsedRooms: RoomUser[] = JSON.parse(storageRooms)

        if (parsedRooms.length > 0) {
          parsedRooms.forEach(room => dispatch(addRoom(room)))
        }
      } else {
        localStorage.setItem('rooms', '[]')
      }
    }
  }, [])

  return (
    <div className={cl.rooms}>
      <Sidebar name={name} setName={setName} />
      <AddRoom />
      { users.length > 0 &&
        <ul className={cl.roomsList}>
          {filteredUsers.map(user =>
            <Room user={user} key={user.id} />
          )}
        </ul>
      }
    </div>
  )
}

export default Rooms