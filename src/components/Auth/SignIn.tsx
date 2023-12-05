import React, { useState } from 'react'
import cl from '../../styles/sign.module.css'
import Form from '../UI/Form/Form'
import { useSignIn } from '../hooks/useSignIn'

const SignIn: React.FC = () => {
  const [message, setMessage] = useState('')
  const signIn = useSignIn(setMessage)


  return (
    <div className={cl.auth}>
      <h1 className={cl.title}>Sign in</h1>
        <Form 
          message={message}
          setMessage={setMessage}
          type='sign-in' 
          btnAction={signIn}
      />
    </div>
  )
}

export default SignIn