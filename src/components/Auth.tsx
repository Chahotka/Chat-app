import React from 'react'
import cl from '../styles/auth.module.css'
import Form from './UI/Form/Form'
import ProfilePicture from './UI/Avatar/ProfilePicture'


const Auth: React.FC = () => {
  return (
    <div className={cl.auth}>
      <h1>Create your profile</h1>
      <ProfilePicture />
      <Form />
    </div>
  )
}

export default Auth