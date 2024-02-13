import React from 'react'
import cl from '../../styles/rooms-list.module.css'
import { RoomUser } from '../../interfaces/RoomUser'
import { NavLink } from 'react-router-dom'
import defImage from './Mogged.png'
import { useAppDispatch } from '../../app/hooks'
import { setActiveRoom } from '../../features/user/UserSlice'

interface Props {
  room: RoomUser
}

const RoomsList: React.FC<Props> = ({ room }) => {
  const dispatch = useAppDispatch()

  return (
    <li onClick={() => dispatch(setActiveRoom(room))} className={cl.room}>
      <NavLink className={cl.link} to={`room/${room.roomId}`}>
        <div className={cl.avatar}>
          <img src={room.avatar || defImage} alt="User avatar" />
        </div>
        <div className={cl.info}>
          <div className={cl.userInfo}>
            <p className={cl.name}>{room.name}</p>
            <p className={cl.time}>12:45</p>
          </div>
          <p className={cl.message}>{room.email}</p>
        </div>
      </NavLink>
    </li>
  )
}

export default RoomsList