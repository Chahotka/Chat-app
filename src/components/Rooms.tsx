import React, { useEffect, useState } from 'react'
import cl from '../styles/rooms.module.css'
import { RoomUser } from '../interfaces/RoomUser'
import RoomsList from './Rooms/RoomsList'
import Sidebar from './Rooms/Sidebar'
import { useFilter } from './hooks/useFilter'
import AddRoom from './Rooms/AddRoom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addRoom } from '../features/user/UserSlice'

interface Props {
  width: number
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Rooms: React.FC<Props> = ({ width, setActive }) => {
  const dispatch = useAppDispatch()
  const rooms = useAppSelector(state => state.user.rooms)
  const [name, setName] = useState('')
  const { filteredUsers } = useFilter(name, rooms)

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
      <div 
        className={cl.sizer}
        style={{left: width}}
        onMouseDown={() => setActive(true)}
      ></div>
      <Sidebar name={name} setName={setName} />
      <AddRoom />
      { rooms.length > 0 &&
        <ul className={cl.roomsList}>
          {filteredUsers.map(user =>
            <RoomsList user={user} key={user.id} />
          )}
        </ul>
      }
    </div>
  )
}

export default Rooms