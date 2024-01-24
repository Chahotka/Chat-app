import React from 'react'
import cl from '../../styles/room-info.module.css'
import { useAppSelector } from '../../app/hooks'
import defImg from './Mogged.png'

const RoomInfo: React.FC = () => {
  const userInfo = useAppSelector(state => state.user.activeRoom)

  if (userInfo === null) {
    return <div></div>
  }

  return (
    <div className={cl.info}>
      <div className={cl.avatar}>
        <img src={userInfo.avatar || defImg} alt="Room avatar" />
      </div>
      <div className={cl.textInfo}>
        <p className={cl.name}>{userInfo.name}</p>
        <p className={cl.email}>{userInfo.email}</p>
      </div>
    </div>
  )
}

export default RoomInfo