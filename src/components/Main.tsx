import React, { useEffect, useState } from 'react'
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
  const authorized = useAppSelector(state => state.auth.authorized)
  const { resizing, setResizing, roomsWidth, grid, onMove } = useResizer()

  useEffect(() => {
    socket.connect()

    const userData = sessionStorage.getItem('user')

    if (typeof userData === 'string') {
      const user = JSON.parse(userData)

      dispatch(authorize())
      dispatch(setProfile(user))
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


