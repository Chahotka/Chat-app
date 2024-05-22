import React from 'react'
import cl from '../../../../../styles/room-info.module.css'
import defImg from '../../../Mogged.png'
import { Channel } from '../../../../hooks/useWebRTC'

interface Props {
  channel: Channel
}

const ChannelUsers: React.FC<Props> = ({ channel }) => {
  return (
      <ul className={cl.channelUsers}>
        {channel.users.sort((a, b) => a.name.localeCompare(b.name)).map(user => 
          <li key={user.id} className={cl.channelUser}>
            <img 
              alt="user avatar" 
              src={user.avatar || defImg} 
              className={cl.channelAvatar}
            />
            <p className={cl.userName}>{ user.name }</p>
          </li>
        )}
    </ul>
  )
}

export default ChannelUsers