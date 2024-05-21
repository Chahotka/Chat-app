import React from 'react'
import cl from '../../../styles/room-info.module.css'
import { GroupUser } from '../../../interfaces/GroupUser'
import { Channel } from '../../hooks/useWebRTC'
import ChannelList from './Group/ChannelList'
import MembersList from './Group/MembersList'

interface Props {
  room: GroupUser
  channels: Channel[]
  createChannel: () => void
  joinChannel: (id: string) => void
}

const GroupInfo: React.FC<Props> = ({ room, channels, createChannel, joinChannel }) => {
  
  return (
    <div className={cl.groupInfo}>
      <ChannelList channels={channels} createChannel={createChannel} joinChannel={joinChannel}/>
      <MembersList room={room}/>
    </div>
  )
}

export default GroupInfo