import React from 'react'
import cl from '../../../../styles/room-info.module.css'
import defImg from '../../Mogged.png'
import arrowImg from '../../../../images/Arrow.svg'
import { Channel } from '../../../hooks/useWebRTC'
import Button from '../../../UI/Button/Button'

interface Props {
  channels: Channel[]
  createChannel: () => void
  joinChannel: (id: string) => void
}

const ChannelList: React.FC<Props> = ({ channels, createChannel, joinChannel }) => {
  const sortedChannels = channels.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <p className={cl.channels}>Channels</p>
      <Button 
        text={'Create channel'} 
        action={createChannel}
        styles={{
          margin: '20px auto 0px auto',
          width: '130px',
          height: '30px',
          fontSize: '9px',
          fontWeight: '600',
          display: 'block'
        }}
      />
      <ul className={cl.channelsList}>
        { sortedChannels.map(channel => 
          <li key={channel.channelId} className={cl.channel}>
            <div className={cl.channelNameBox}>
              <p>{channel.name}</p>
              <img 
                alt="join channel" 
                title='Join channel'
                src={arrowImg}
                className={cl.joinChannel}
                onClick={() => joinChannel(channel.channelId)}
              />
            </div>
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
          </li>
        )}
      </ul>
    </>
  )
}

export default ChannelList