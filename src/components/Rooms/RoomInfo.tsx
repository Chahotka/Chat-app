import React from 'react'
import cl from '../../styles/room-info.module.css'
import { useAppSelector } from '../../app/hooks'
import defImg from './Mogged.png'
import DirectInfo from './RoomInfo/DirectInfo'
import GroupInfo from './RoomInfo/GroupInfo'
import { Channel } from '../hooks/useWebRTC'

interface Props {
  joinedId: string | undefined
  groupChannels: Channel[]
  createChannel: () => void
  joinChannel: (id: string) => void
  leaveChannel: () => void
}

const RoomInfo: React.FC<Props> = ({ joinedId, groupChannels, createChannel, joinChannel, leaveChannel}) => {
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
          : <GroupInfo 
              room={room} 
              joinedId={joinedId}
              channels={groupChannels} 
              createChannel={createChannel} 
              joinChannel={joinChannel}
              leaveChannel={leaveChannel}
            />
        }
      </div>
    </div>
  )
}

export default RoomInfo