import React, { useEffect, useState } from 'react'
import cl from '../../styles/sign.module.css'
import { useSignUp } from '../hooks/useSignUp'
import Loader from '../UI/Loader/Loader'
import Input from '../UI/Input/Input'
import Button from '../UI/Button/Button'
import Message from '../UI/Message/Message'
import { useValidate } from '../hooks/useValidate'


const SignUp: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState(false)
  const [message, setMessage] = useState('')
  const { validateProfile } = useValidate(email, password, setValid, setMessage, name)
  const { signUp, loading } = useSignUp(valid, name, email, password, setMessage)

  useEffect(() => {
    validateProfile()
  }, [name, email, password])

  return (
    <div 
      className={ loading ? [cl.auth, cl.active].join(' ') : cl.auth }
    >
      <h1 className={cl.title}>Sign up</h1>
      { loading && <Loader size='large' pos='center' /> }
      <Message message={message}/>
      <form className={cl.form} autoComplete='off'>
        <Input type='name' value={name} setValue={setName}/>
        <Input type='email' value={email} setValue={setEmail}/>
        <Input type='password' value={password} setValue={setPassword}/>
        <Button 
          text='Sign up' 
          action={signUp}
          styles={{
            margin: '20px auto 0 auto'
          }}
        />
      </form>
    </div>
  )
}

export default SignUp