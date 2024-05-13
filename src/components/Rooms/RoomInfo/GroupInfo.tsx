import React from 'react'
import cl from '../../../styles/room-info.module.css'
import { GroupUser } from '../../../interfaces/GroupUser'
import { Channel } from '../../hooks/useWebRTC'
import ChannelList from './Group/ChannelList'
import MembersList from './Group/MembersList'

interface Props {
  room: GroupUser
  channels: Channel[]
}

const GroupInfo: React.FC<Props> = ({ room, channels }) => {
  
  return (
    <div className={cl.groupInfo}>
      { channels.length > 0 && <ChannelList channels={channels}/>}
      <MembersList room={room}/>
    </div>
  )
}

export default GroupInfo