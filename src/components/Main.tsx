import React, { useEffect, useState } from 'react'
import cl from '../styles/main.module.css'
import Rooms from './Rooms'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setProfile } from '../features/user/UserSlice'
import { authorize } from '../features/auth/AuthSlice'

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  const authorized = useAppSelector(state => state.auth.authorized)
  const [roomsWidth, setRoomsWidth] = useState(300)
  const [active, setActive] = useState(false)

  useEffect(() => {
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
      className={active ? [cl.main, cl.resize].join(' ') : cl.main}
      style={{
        gridTemplateColumns: `minmax(200px,${roomsWidth <= 200 ? '200px' : roomsWidth > window.innerWidth - 400 ? window.innerWidth - 400 : roomsWidth}px) minmax(400px, 1fr)`
      }}
      onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => setActive(false)}
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => active && setRoomsWidth(e.clientX)}
    >
      <Rooms width={roomsWidth} setWidth={setRoomsWidth} setActive={setActive}/>
      <Outlet />
    </div>
  )
}

export default Main