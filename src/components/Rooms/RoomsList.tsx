import React, { useEffect } from 'react'
import cl from '../../styles/rooms-list.module.css'
import { RoomUser } from '../../interfaces/RoomUser'
import { NavLink } from 'react-router-dom'
import defImage from './Mogged.png'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setActiveRoom } from '../../features/user/UserSlice'
import { useMessages } from '../hooks/useMessages'
import { Message } from '../../interfaces/Message'
import { useDateConverter } from '../hooks/useDateConverter'
import { socket } from '../../socket/socket'

interface Props {
  room: RoomUser
}

const RoomsList: React.FC<Props> = ({ room }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const { messages, lastMessage, getLastMessage } = useMessages(room)

  const onMessage = (messageObj: Message) => {
    if (room.roomId === messageObj.roomId) {
      getLastMessage([messageObj])
    }
  }

  useEffect(() => {
    socket.on('message sended', onMessage)

    return () => {
      socket.off('message sended', onMessage)
    }
  }, [messages])

  return (
    <li onClick={() => dispatch(setActiveRoom(room))} className={cl.room}>
      <NavLink className={cl.link} to={`room/${room.roomId}`}>
        <div className={cl.avatar}>
          <img src={room.avatar || defImage} alt="User avatar" />
        </div>
        <div className={cl.info}>
          <div className={cl.userInfo}>
            <p className={cl.name}>{room.name}</p>
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