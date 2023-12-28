import React from 'react'
import cl from '../styles/main.module.css'
import Rooms from './Rooms'
import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

const Main: React.FC = () => {
  const user = useAppSelector(state => state.user)

  return (
    <div className={cl.main}>
      <Rooms />
      <Outlet />
    </div>
  )
}

export default Main