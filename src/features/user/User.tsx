import React, { useState } from 'react'
import cl from '../../styles/user.module.css'
import { useAppSelector } from '../../app/hooks'
import Avatar from '../../components/UI/Avatar/Avatar'

const User: React.FC = () => {
  const user = useAppSelector(state => state.user)
  const [changeAvatar, setChangeAvatar] = useState(false)

  return (
    <div className={cl.user}>
      <div className={cl.container}>
          <h1 className={cl.title}>User Info</h1>
        <div className={cl.info}>
          <Avatar avtSize='medium' changeAvatar={changeAvatar} setChangeAvatar={setChangeAvatar}/>
          <div className={cl.userText}>
            <p>User name: { user.nick }</p>
            <p>User email: { user.email }</p>
          </div>
        </div>
        <div className={cl.options}>
          <button className={cl.exit}>Exit account</button>
        </div>
      </div>
    </div>
  )
}

export default User