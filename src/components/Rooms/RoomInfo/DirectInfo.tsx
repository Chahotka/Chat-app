import React from 'react'
import cl from '../../../styles/room-info.module.css'
import { RoomUser } from '../../../interfaces/RoomUser'

interface Props {
  room: RoomUser
}

const DirectInfo: React.FC<Props> = ({ room }) => {
  return (
    <div className={cl.directInfo}>
      <p className={cl.roomEmail}>{ room.email }</p>
    </div>
  )
}

export default DirectInfo