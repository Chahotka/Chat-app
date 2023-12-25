import React from 'react'
import cl from '../styles/main.module.css'
import Rooms from './Rooms'
import Chat from './Main/Chat'
import RoomInfo from './RoomInfo'
import { useAppSelector } from '../app/hooks'

const Main: React.FC = () => {
  const user = useAppSelector(state => state.user)


  return (
    <div className={cl.main}>
      <Rooms users={user.rooms} />
      <Chat />
      <RoomInfo />
    </div>
  )
}

export default Main