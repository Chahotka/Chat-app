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
  const user = useAppSelector(state => state.user)
  const authorized = useAppSelector(state => state.auth.authorized)
  const { resizing, setResizing, roomsWidth, grid, onMove } = useResizer()


  const onJoined = (socketId: string, roomId: string) => {
    console.log('Getting messages')
    if (socket.id === socketId) {
      socket.emit('get messages', roomId)
    }
  }

  const onMessagesHistory = (messages: Message[], roomId: string, socketId: string) => {
    console.log('MEssages received')
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

    socket.on('joined', onJoined)
    socket.on('messages history', onMessagesHistory)

    return () => {
      socket.off('joined', onJoined)
      socket.off('messages history', onMessagesHistory)
    }
  }, [])

  useEffect(() => {
    if (user.rooms.length > 0) {
      const roomIds = user.rooms.map(room => room.roomId)

      socket.emit('join rooms', roomIds)
    }
  }, [user])


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


