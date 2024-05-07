import React, { useState } from 'react'
import cl from '../../../../styles/add-chat.module.css'
import { RoomUser } from '../../../../interfaces/RoomUser'

interface Props {
  room: RoomUser
  setSelected: React.Dispatch<React.SetStateAction<RoomUser[]>>
}

const RoomSelect: React.FC<Props> = ({ room, setSelected }) => {
  const [isSelected, setIsSelected] = useState(false)
  
  const selectHandler = () => {
    if (!isSelected) {
      setIsSelected(true)
      setSelected(prev => [...prev, room])
    } else {
      setIsSelected(false)
      setSelected(prev => prev.filter(selectedRoom => selectedRoom.id !== room.id))
    }
  }

  return (
    <li  className={cl.room}>
      <p className={cl.roomName}>{ room.name }</p>
      <div 
        className={isSelected 
          ? [cl.addButton, cl.selected].join(' ') 
          : cl.addButton
        }
        onClick={selectHandler}
      />
    </li>
  )
}

export default RoomSelect