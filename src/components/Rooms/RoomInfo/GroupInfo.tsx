import React from 'react'
import cl from '../../../styles/room-info.module.css'
import { GroupUser } from '../../../interfaces/GroupUser'
import defImg from '../Mogged.png'
import crown from '../../../images/crown.svg'
import { useAppSelector } from '../../../app/hooks'
import { Channel } from '../../hooks/useWebRTC'

interface Props {
  room: GroupUser
  channels: Channel[]
}

const GroupInfo: React.FC<Props> = ({ room, channels }) => {
  const userState = useAppSelector(state => state.user)
  const creator = userState.id === room.creator
  
  return (
    <div className={cl.groupInfo}>
      <p className={cl.channels}>Channels</p>
      <ul className={cl.channelsList}>
        { channels.map(channel => 
          <li className={cl.channel}>
            <p className={cl.channelName}>{channel.name}</p>
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
      <p className={cl.members}>Members</p>
      <ul className={cl.usersList}>
          <li className={cl.user}>
            <div className={cl.userAvatarWrapper}>
              <img
                alt='user avatar'
                className={cl.userAvatar}
                src={userState.avatar || defImg}
              />
            </div>
            <div className={cl.userName}>
              <p>{ userState.name }</p>
              { creator &&
                <img
                  alt='crown'
                  src={crown}
                  className={cl.crown}
                  title='Group owner'
                />
              }
            </div>
          </li>
        {room.users.map(user =>
          <li key={user.id} className={cl.user}>
            <div className={cl.userAvatarWrapper}>
              <img
                alt='user avatar'
                className={cl.userAvatar}
                src={user.avatar || defImg}
              />
            </div>
            <div className={cl.userName}>
              <p>{ user.name }</p>
              { user.id === room.creator &&
                <img
                  alt='crown'
                  src={crown}
                  className={cl.crown}
                  title='Group creator'
                />
              }
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default GroupInfo