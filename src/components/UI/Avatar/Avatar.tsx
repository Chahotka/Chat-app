import React from 'react'
import cl from './avatar.module.css'
import pen from '../../../images/pen.svg'
import { useAppSelector } from '../../../app/hooks'

interface Props {
  changeAvatar: boolean
  setChangeAvatar: React.Dispatch<React.SetStateAction<boolean>>
}

const Avatar: React.FC<Props> = ({changeAvatar, setChangeAvatar}) => {
  const avatar = useAppSelector(state => state.user.avatar)

  return (
    <div className={cl.avatarBox}>
      <div 
        className={cl.avatarContainer}
        onClick={() => setChangeAvatar(true)}
      >
        { avatar && <img className={cl.avatar} src={avatar} /> }
        <div className={cl.penContainer}>
          <img className={cl.pen} src={pen}/>
        </div>
      </div>
    </div>
  )
}

export default Avatar