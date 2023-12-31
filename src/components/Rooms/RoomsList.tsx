import React from 'react'
import cl from '../../styles/rooms-list.module.css'
import { RoomUser } from '../../interfaces/RoomUser'
import { NavLink } from 'react-router-dom'
import defImage from './Mogged.png'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setActiveRoom } from '../../features/user/UserSlice'

interface Props {
  user: RoomUser
}

const RoomsList: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch()

  return (
    <li onClick={() => dispatch(setActiveRoom(user))} className={cl.room}>
      <NavLink className={cl.link} to={`room/${user.roomId}`}>
        <div className={cl.avatar}>
          <img src={user.avatar || defImage} alt="User avatar" />
        </div>
        <div className={cl.info}>
          <div className={cl.userInfo}>
            <p className={cl.name}>{ user.name }</p>
            <p className={cl.time}>12:45</p>
          </div>
          <p className={cl.message}>{ user.email }</p>
        </div>
      </NavLink>
    </li>
  )
}

export default RoomsList