import React, { useEffect, useState } from 'react'
import cl from '../../styles/rooms-list.module.css'
import { RoomUser } from '../../interfaces/RoomUser'
import { NavLink } from 'react-router-dom'
import defImage from './Mogged.png'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setActiveRoom } from '../../features/user/UserSlice'
import { Message } from '../../interfaces/Message'
import { useDateConverter } from '../hooks/useDateConverter'

interface Props {
  room: RoomUser
}

interface LastMessage {
  userId: string
  message: string
  time: string
}

const RoomsList: React.FC<Props> = ({ room }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const [lastMessage, setLastMessage] = useState<LastMessage>({
    userId: '',
    message: '',
    time: ''
  })
  const { dateConverter } = useDateConverter()

  useEffect(() => {
    const storedMessages = sessionStorage.getItem(room.roomId)

    if (typeof storedMessages === 'string') {
      const parsedMessages: Message[] = JSON.parse(storedMessages)

      if (parsedMessages.length === 0) {
        setLastMessage({
          time: '',
          userId: '',
          message: 'Send your first message'
        })
      } else {
        const lastMessage = parsedMessages[parsedMessages.length - 1]
        const dateObj = dateConverter(lastMessage.createdAt)
  
        let time = ''
  
        if (dateObj.day !== dateObj.curDay) {
          time = dateObj.day
        } else {
          time = `${dateObj.hh}:${dateObj.mm}`
        }
        
        setLastMessage({
          userId: lastMessage.userId, 
          message: lastMessage.textOrPath,
          time
        })
      }
    }
  }, [])

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