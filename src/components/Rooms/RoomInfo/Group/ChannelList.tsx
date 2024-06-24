import React from 'react'
import cl from '../../../../styles/room-info.module.css'
import leave from '../../../../images/leave.svg'
import join from '../../../../images/Arrow.svg'
import { Channel } from '../../../hooks/useWebRTC'
import Button from '../../../UI/Button/Button'
import ChannelUsers from './Channel/ChannelUsers'

interface Props {
  joinedId: string | undefined
  channels: Channel[]
  createChannel: () => void
  joinChannel: (id: string) => void
  leaveChannel: () => void
}

const ChannelList: React.FC<Props> = ({ joinedId, channels, createChannel, joinChannel, leaveChannel }) => {
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
              { channel.channelId === joinedId
                ?
                <img 
                  alt='Leave Channel'
                  title='Leave Channel'
                  src={leave}
                  className={cl.joinChannel}
                  onClick={() => leaveChannel()}
                />
                :
                <img 
                  alt="join channel" 
                  title='Join channel'
                  src={join}
                  className={cl.joinChannel}
                  onClick={() => joinChannel(channel.channelId)}
                />
              }
            </div>
            <ChannelUsers channel={channel}/>
          </li>
        )}
      </ul>
    </>
  )
}

export default ChannelList