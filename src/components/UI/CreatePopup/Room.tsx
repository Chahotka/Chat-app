import React, { useState } from 'react'
import cl from './create-popup.module.css'
import { RoomUser } from '../../../interfaces/RoomUser'
import { AddHandler } from './CreatePopup'

interface Props {
  room: RoomUser
  addHandler: AddHandler
}

const Room: React.FC<Props> = ({ room, addHandler }) => {
  const [selected, setSelected] = useState(false)
  
  return (
    <li  className={cl.room}>
      <p className={cl.roomName}>{ room.name }</p>
      <div 
        className={selected ? [cl.add, cl.active].join(' ') : cl.add}
        onClick={() => addHandler(room.id, !selected, setSelected)}
      />
    </li>
  )
}

export default Room