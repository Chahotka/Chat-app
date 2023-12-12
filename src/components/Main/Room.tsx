import React from 'react'
import cl from '../../styles/room.module.css'
import { RoomUser } from '../../interfaces/RoomUser'
import image from './Mogged.png'

interface Props {
  user: RoomUser
}

const Room: React.FC<Props> = ({ user }) => {

  return (
    <div className={cl.room}>
      <div className={cl.avatar}>
        <img src={image} alt="User avatar" />
      </div>
      <div className={cl.info}>
        <div className={cl.userInfo}>
          <p className={cl.name}>{ user.name }</p>
          <p className={cl.time}>{ user.lastSeen }</p>
        </div>
        <p className={cl.message}>Soemkfjlas dds asd fasd af  ahfsadio ha</p>
      </div>
    </div>
  )
}

export default Room