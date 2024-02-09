import React, { useEffect } from 'react'
import cl from '../../styles/rooms-list.module.css'
import { RoomUser } from '../../interfaces/RoomUser'
import { NavLink } from 'react-router-dom'
import defImage from './Mogged.png'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setActiveRoom } from '../../features/user/UserSlice'
import { socket } from '../../socket/socket'

interface Props {
  room: RoomUser
}

const RoomsList: React.FC<Props> = ({ room }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)

  const onJoin = () => {
    if (user.activeRoom !== null && user.activeRoom.id === room.id) {
      return
    }
    if (user.activeRoom) {
      socket.emit('leave', user.activeRoom.id)
    }

    dispatch(setActiveRoom(room))
    socket.emit('join', room.roomId)
  }

  const onJoined = (socketId: string, roomId: string) => {
    if (room.roomId === roomId) {
      console.log('SOCKET: ', socketId, ' JOINED ROOM: ', roomId)
    }
  }

  const onLeft = (socketId: string, roomId: string) => {
    if (room.roomId === roomId) {
      console.log('SOCKET: ', socketId, 'LEFT ROOM: ', roomId)
    }
  }

  useEffect(() => {
    socket.on('joined', onJoined)
    socket.on('left', onLeft)

    return () => {
      socket.off('joined', onJoined)
      socket.off('left', onLeft)
    }
  }, [])

  return (
    <li onClick={onJoin} className={cl.room}>
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