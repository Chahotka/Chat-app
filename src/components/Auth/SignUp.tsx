import React, { useState, useEffect } from 'react'
import cl from '../../styles/sign.module.css'
import Form from '../UI/Form/Form'
import { useAppDispatch } from '../../app/hooks'
import { createProfile } from '../../features/user/UserSlice'
import { v4 } from 'uuid'
import { useSignUp } from '../hooks/useSignUp'
import AvatarEditor from './AvatarEditor'
import Avatar from '../UI/Avatar/Avatar'


const SignUp: React.FC = () => {
  const [error, setError] = useState('')
  const [changeAvatar, setChangeAvatar] = useState(false)
  const signUp = useSignUp(setError)
  const dispath = useAppDispatch()


  useEffect(() => {
    dispath(createProfile(v4()))
  }, [])



  return (
    <div className={cl.auth}>
      <h1 className={cl.title}>Sign up</h1>
      { changeAvatar && <AvatarEditor setChangeAvatar={setChangeAvatar}/> }
      { !changeAvatar &&
        <>
          <Avatar avtSize='large' changeAvatar={changeAvatar} setChangeAvatar={setChangeAvatar}/>
          <Form 
            error={error}
            setError={setError}
            type='sign-up' 
            btnAction={(e: React.MouseEvent) => signUp(e)}
          /> 
        </>
      }
    </div>
  )
}

export default SignUp