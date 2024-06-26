import React from 'react'
import cl from '../../styles/room-info.module.css'
import { useAppSelector } from '../../app/hooks'
import defImg from './Mogged.png'
import DirectInfo from './RoomInfo/DirectInfo'
import GroupInfo from './RoomInfo/GroupInfo'

const RoomInfo: React.FC = () => {
  const room = useAppSelector(state => state.user.activeRoom)

  if (!room) {
    return <></>
  }

  return (
    <div className={cl.info}>
      <div className={cl.avatarWrapper}>
        <img 
          className={cl.avatar} 
          src={defImg || room.avatar} 
          alt="avatar" 
        />
      </div>
      <div className={cl.roomInfo}>
        <p className={cl.roomName}>{ room.name }</p>
        { room.type === 'direct'
          ? <DirectInfo room={room}/>
          : <GroupInfo room={room}/>
        }
      </div>
    </div>
  )
}

export default RoomInfo