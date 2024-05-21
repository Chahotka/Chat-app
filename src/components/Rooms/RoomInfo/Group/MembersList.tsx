import React from 'react'
import cl from '../../../../styles/room-info.module.css'
import { useAppSelector } from '../../../../app/hooks'
import defImg from '../../Mogged.png'
import crown from '../../../../images/crown.svg'
import { GroupUser } from '../../../../interfaces/GroupUser'

interface Props {
  room: GroupUser
}

const MembersList: React.FC<Props> = ({ room }) => {
  const userState = useAppSelector(state => state.user)
  const creator = userState.id === room.creator
  const members = [...room.users].sort((a, b) => a.name.localeCompare(b.name))
  
  return (
    <>
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
        {members.map(user =>
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
    </>
  )
}

export default MembersList