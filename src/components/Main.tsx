import React, { useEffect } from 'react'
import cl from '../styles/main.module.css'
import Rooms from './Rooms'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setProfile } from '../features/user/UserSlice'
import { authorize } from '../features/auth/AuthSlice'
import { useResizer } from './hooks/useResizer'
import { socket } from '../socket/socket'

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const authorized = useAppSelector(state => state.auth.authorized)
  const { resizing, setResizing, roomsWidth, grid, onMove } = useResizer()

  const onConnect = () => {
    socket.emit('connected', user.id)
  }
  const onConnected = (userId: string) => {
    if (user.id === userId) {
      console.log('Socket ID: ', socket.id)
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

    socket.on('connect', onConnect)
    socket.on('connected', onConnected)

    return () => {
      socket.off('connect', onConnect)
      socket.off('connected', onConnected)
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


