import React, { useState, useEffect } from 'react'
import cl from '../styles/auth.module.css'
import Form from './UI/Form/Form'
import { UserDataInterface } from '../interfaces/UserDataInterface'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import Avatar from './UI/Avatar/Avatar'
import AvatarEditor from './Auth/AvatarEditor'


const Auth: React.FC = () => {
  const [pfp, setPfp] = useState('')
  const [changeAvatar, setChangeAvatar] = useState(false)




  return (
    <div className={cl.auth}>
      <h1 className={cl.title}>Create your profile</h1>
      { changeAvatar && <AvatarEditor setChangeAvatar={setChangeAvatar}/> }
      { !changeAvatar && 
        <>
          <Avatar changeAvatar={changeAvatar} setChangeAvatar={setChangeAvatar}/>
          <Form /> 
        </>
      }
    </div>
  )
}

export default Auth