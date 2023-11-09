import React from 'react'
import cl from './avatar.module.css'
import pen from '../../../images/pen.svg'
import { useAppSelector } from '../../../app/hooks'

interface Props {
  avtSize: 'large' | 'medium' | 'small'
  changeAvatar: boolean
  setChangeAvatar: React.Dispatch<React.SetStateAction<boolean>>
}

const Avatar: React.FC<Props> = ({avtSize, changeAvatar, setChangeAvatar}) => {
  const avatar = useAppSelector(state => state.user.avatar)
  const sizeStyle = [cl.avatarContainer]

  if (avtSize === 'large') {
    sizeStyle.push(cl.large)
  } else if (avtSize === 'medium') {
    sizeStyle.push(cl.medium)
  } else if (avtSize === 'small') {
    sizeStyle.push(cl.small)
  }

  return (
    <div className={cl.avatarBox}>
      <div 
        className={sizeStyle.join(' ')}
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