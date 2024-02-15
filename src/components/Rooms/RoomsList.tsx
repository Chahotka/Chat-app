import React from 'react'
import cl from '../../styles/rooms-list.module.css'
import { RoomUser } from '../../interfaces/RoomUser'
import { NavLink } from 'react-router-dom'
import defImage from './Mogged.png'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setActiveRoom } from '../../features/user/UserSlice'
import { useLastMessage } from '../hooks/useLastMessage'

interface Props {
  room: RoomUser
}

const RoomsList: React.FC<Props> = ({ room }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const { lastMessage } = useLastMessage(room)

  return (
    <li onClick={() => dispatch(setActiveRoom(room))} className={cl.room}>
      <NavLink className={cl.link} to={`room/${room.roomId}`}>
        <div className={cl.avatar}>
          <img src={room.avatar || defImage} alt="User avatar" />
        </div>
        <div className={cl.info}>
          <div className={cl.userInfo}>
            <p className={cl.name}>{ room.name }</p>
            <p className={cl.time}>
              {lastMessage.time}
            </p>
          </div>
          <p className={cl.message}>
            <span>{ lastMessage.userId === user.id && 'You: ' }</span>
            <span>{ lastMessage.message }</span>
          </p>
        </div>
      </NavLink>
    </li>
  )
}

export default RoomsList