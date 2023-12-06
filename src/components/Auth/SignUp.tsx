import React, { useState } from 'react'
import cl from '../../styles/sign.module.css'
import Form from '../UI/Form/Form'
import { useSignUp } from '../hooks/useSignUp'
import { useFetch } from '../hooks/useFetch'
import Loader from '../UI/Loader/Loader'


const SignUp: React.FC = () => {
  const [valid, setValid] = useState(false)
  const [message, setMessage] = useState('')
  const {signUp, loading} = useSignUp(valid, setMessage)


  return (
    <div 
      className={ loading ? [cl.auth, cl.active].join(' ') : cl.auth }
    >
      <h1 className={cl.title}>Sign up</h1>
      { loading && <Loader size='large' pos='center' /> }
      <Form 
        message={message}
        setMessage={setMessage}
        setValid={setValid}
        type='sign-up' 
        btnAction={(e: React.MouseEvent) => signUp(e)}
      /> 
    </div>
  )
}

export default SignUp