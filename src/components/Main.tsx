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
  const [width, setWidth] = useState(250)
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

  console.log(active)

  return (
    <div 
      className={cl.main}
      style={{
        gridTemplateColumns: `minmax(200px,${width}px) 1fr`
      }}
      onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => setActive(true)}
      onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => setActive(false)}
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => active && setWidth(e.clientX)}
    >
      <Rooms />
      <Outlet />
    </div>
  )
}

export default Main