import React from 'react'
import cl from '../../../../styles/room-info.module.css'
import defImg from '../../Mogged.png'
import arrowImg from '../../../../images/Arrow.svg'
import { Channel } from '../../../hooks/useWebRTC'

interface Props {
  channels: Channel[]
}

const ChannelList: React.FC<Props> = ({ channels }) => {
  return (
    <>
      <p className={cl.channels}>Channels</p>
      <ul className={cl.channelsList}>
        { channels.map(channel => 
          <li className={cl.channel}>
            <div className={cl.channelNameBox}>
              <p>{channel.name}</p>
              <img 
                alt="join channel" 
                title='Join channel'
                src={arrowImg}
                className={cl.joinChannel}
              />
            </div>
            <ul className={cl.channelUsers}>
                {channel.users.map(user => 
                  <li className={cl.channelUser}>
                    <img 
                      alt="user avatar" 
                      src={user.avatar || defImg} 
                      className={cl.channelAvatar}
                    />
                    <p className={cl.userName}>{ user.name }</p>
                  </li>
                )}
            </ul>
          </li>
        )}
      </ul>
    </>
  )
}

export default ChannelList