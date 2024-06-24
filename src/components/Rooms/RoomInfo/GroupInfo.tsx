import React from 'react'
import cl from '../../../styles/room-info.module.css'
import { GroupUser } from '../../../interfaces/GroupUser'
import { Channel } from '../../hooks/useWebRTC'
import ChannelList from './Group/ChannelList'
import MembersList from './Group/MembersList'

interface Props {
  room: GroupUser
  joinedId: string | undefined
  channels: Channel[]
  createChannel: () => void
  joinChannel: (id: string) => void
  leaveChannel: () => void
}

const GroupInfo: React.FC<Props> = ({ room, joinedId, channels, createChannel, joinChannel, leaveChannel }) => {
  
  return (
    <div className={cl.groupInfo}>
      <ChannelList 
        joinedId={joinedId}
        channels={channels} 
        createChannel={createChannel} 
        joinChannel={joinChannel}
        leaveChannel={leaveChannel}
      />
      <MembersList room={room}/>
    </div>
  )
}

export default GroupInfo