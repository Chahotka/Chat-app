import React, { useState, useEffect } from 'react'
import cl from '../../styles/sign.module.css'
import { dbHandler } from '../../firebase/firebase'
import Form from '../UI/Form/Form'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearProfile } from '../../features/user/UserSlice'
import { useSignIn } from '../hooks/useSignIn'

const SignIn: React.FC = () => {
  const user = useAppSelector(state => state.user)
  const dispath = useAppDispatch()
  const [error, setError] = useState('')
  const signIn = useSignIn(setError)


  return (
    <div className={cl.auth}>
      <h1 className={cl.title}>Sign in</h1>
        <Form 
          error={error}
          setError={setError}
          type='sign-in' 
          btnAction={signIn}
      />
    </div>
  )
}

export default SignIn