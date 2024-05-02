import React, { useState } from 'react'
import cl from '../styles/rooms.module.css'
import RoomsList from './Rooms/RoomsList'
import Sidebar from './Rooms/Sidebar'
import { useFilter } from './hooks/useFilter'
import { useRooms } from './hooks/useRooms'
import { useEscape } from './hooks/useEscape'
import CreatePopup from './UI/CreatePopup/CreatePopup'
import AddDirectChat from './Rooms/Sidebar/SidebarOptions/AddDirectChat'

interface Props {
  width: number
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Rooms: React.FC<Props> = ({ width, setActive }) => {
  const [name, setName] = useState('')
  const [showGroup, setShowGroup] = useState(false)
  const [showDirect, setShowDirect] = useState(false)

  const { rooms } = useRooms()
  const { filteredRooms } = useFilter(name, rooms)
  const { sidebarActive, setSidebarActive } = useEscape()


  return (
    <div className={cl.rooms}>
      <Sidebar
        name={name}
        setName={setName}
        active={sidebarActive}
        setActive={setSidebarActive}
        setShowGroup={setShowGroup}
        setShowDirect={setShowDirect}
      />
      { showDirect && <AddDirectChat setActive={setShowDirect}/>}
      {rooms.length > 0 &&
        <ul className={cl.roomsList}>
          {filteredRooms.map(room =>
            <RoomsList room={room} key={room.roomId} />)}
        </ul>
      }
    </div>
  )
}

export default Rooms