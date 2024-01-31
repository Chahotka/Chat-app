import React, { useState } from 'react'
import cl from '../styles/rooms.module.css'
import RoomsList from './Rooms/RoomsList'
import Sidebar from './Rooms/Sidebar'
import { useFilter } from './hooks/useFilter'
import AddRoom from './Rooms/AddRoom'
import { useRooms } from './hooks/useRooms'

interface Props {
  width: number
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Rooms: React.FC<Props> = ({ width, setActive }) => {
  const [name, setName] = useState('')
  const { rooms } = useRooms()
  const { filteredUsers } = useFilter(name, rooms)

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