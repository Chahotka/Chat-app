import React, { useEffect } from 'react'
import cl from '../styles/main.module.css'
import Rooms from './Rooms'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setProfile } from '../features/user/UserSlice'
import { authorize } from '../features/auth/AuthSlice'

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  const authorized = useAppSelector(state => state.auth.authorized)

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
    <div className={cl.main}>
      <Rooms />
      <Outlet />
    </div>
  )
}

export default Main