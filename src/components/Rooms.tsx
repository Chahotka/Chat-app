import React, { useState } from 'react'
import cl from '../styles/rooms.module.css'
import RoomsList from './Rooms/RoomsList'
import Sidebar from './Rooms/Sidebar'
import { useFilter } from './hooks/useFilter'
import AddRoom from './Rooms/Sidebar/AddRoom'
import { useRooms } from './hooks/useRooms'
import { useEscape } from './hooks/useEscape'

interface Props {
  width: number
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Rooms: React.FC<Props> = ({ width, setActive }) => {
  const [name, setName] = useState('')
  const { rooms } = useRooms()
  const { filteredRooms } = useFilter(name, rooms)
  const { sidebarActive, setSidebarActive } = useEscape()


  return (
    <div className={cl.rooms}>
      <div
        className={cl.sizer}
        style={{ left: width }}
        onMouseDown={() => setActive(true)}
      ></div>
      <Sidebar
        active={sidebarActive}
        setActive={setSidebarActive}
        name={name}
        setName={setName}
      />
      {rooms.length > 0 &&
        <ul className={cl.roomsList}>
          {filteredRooms.map(room =>
            <RoomsList room={room} key={room.id} />)}
        </ul>
      }
    </div>
  )
}

export default Rooms