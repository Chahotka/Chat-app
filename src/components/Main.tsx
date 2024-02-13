import React, { useEffect } from 'react'
import cl from '../styles/main.module.css'
import Rooms from './Rooms'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setProfile } from '../features/user/UserSlice'
import { authorize } from '../features/auth/AuthSlice'
import { useResizer } from './hooks/useResizer'
import { socket } from '../socket/socket'
import { Message } from '../interfaces/Message'

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  const rooms = useAppSelector(state => state.user.rooms)
  const authorized = useAppSelector(state => state.auth.authorized)
  const { resizing, setResizing, roomsWidth, grid, onMove } = useResizer()

  const onConnected = (socketId: string) => {
    if (socket.id === socketId) {
      const roomIds = rooms.map(room => room.roomId)

      socket.emit('join rooms', roomIds)
    }
  }
  const onJoined = (socketId: string, roomId: string) => {
    if (socket.id === socketId) {
      socket.emit('get messages', roomId)
    }
  }
  const onMessagesHistory = (messages: Message[], roomId: string, socketId: string) => {
    if (socket.id === socketId) {
      sessionStorage.setItem(roomId, JSON.stringify(messages))
    }
  }


  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
  
      const userData = sessionStorage.getItem('user')
  
      if (typeof userData === 'string') {
        const user = JSON.parse(userData)
  
        dispatch(authorize())
        dispatch(setProfile(user))
      }
    }

    socket.on('connected', onConnected)
    socket.on('joined', onJoined)
    socket.on('messages history', onMessagesHistory)

    return () => {
      socket.off('connected', onConnected)
      socket.off('joined', onJoined)
      socket.off('messages history', onMessagesHistory)
    }
  }, [])


  if (!authorized) {
    return <Navigate to='/auth' />
  }

  return (
    <div 
      className={resizing ? [cl.main, cl.resize].join(' ') : cl.main}
      style={{
        gridTemplateColumns: grid
      }}
      onMouseUp={() => setResizing(false)}
      onMouseMove={(e) => onMove(e)}
    >
      <Rooms width={roomsWidth} setActive={setResizing}/>
      <Outlet />
    </div>
  )
}

export default Main


