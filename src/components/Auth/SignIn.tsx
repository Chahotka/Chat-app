import React, { useState } from 'react'
import cl from '../../styles/sign.module.css'
import Form from '../UI/Form/Form'
import { useSignIn } from '../hooks/useSignIn'
import Loader from '../UI/Loader/Loader'

const SignIn: React.FC = () => {
  const [valid, setValid] = useState(false)
  const [message, setMessage] = useState('')
  const { signIn, loading } = useSignIn(valid, setMessage)

  return (
    <div className={cl.auth}>
      <h1 className={cl.title}>Sign in</h1>
        { loading && <Loader size='large' pos='center' /> }
        <Form 
          setValid={setValid}
          message={message}
          setMessage={setMessage}
          type='sign-in' 
          btnAction={(e: React.MouseEvent) => signIn(e)}
      />
    </div>
  )
}

export default SignIn