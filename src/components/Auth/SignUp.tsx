import React, { useState } from 'react'
import cl from '../../styles/sign.module.css'
import Form from '../UI/Form/Form'
import { useSignUp } from '../hooks/useSignUp'


const SignUp: React.FC = () => {
  const [valid, setValid] = useState(false)
  const [error, setError] = useState('')
  const signUp = useSignUp(valid, setError)


  return (
    <div className={cl.auth}>
      <h1 className={cl.title}>Sign up</h1>
      <Form 
        error={error}
        setError={setError}
        setValid={setValid}
        type='sign-up' 
        btnAction={(e: React.MouseEvent) => signUp(e)}
      /> 
    </div>
  )
}

export default SignUp