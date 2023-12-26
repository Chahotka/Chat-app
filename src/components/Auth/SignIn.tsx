import React, { useEffect, useState } from 'react'
import cl from '../../styles/sign.module.css'
import { useSignIn } from '../hooks/useSignIn'
import Loader from '../UI/Loader/Loader'
import { useAppSelector } from '../../app/hooks'
import { useNavigate } from 'react-router-dom'
import Input from '../UI/Input/Input'
import Button from '../UI/Button/Button'
import Message from '../UI/Message/Message'
import { useValidate } from '../hooks/useValidate'

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const isAuth = useAppSelector(state => state.auth.authorized)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const { signIn, loading } = useSignIn(email, password, setMessage)

  useEffect(() => {
    if (isAuth) {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    setMessage('')
  }, [email, password])

  return (
    <div className={cl.auth}>
      <h1 className={cl.title}>Sign in</h1>
      { loading && <Loader size='large' pos='center' /> }
      <form className={cl.form} autoComplete='off'>
        <Message message={message}/>
        <Input type='email' value={email} setValue={setEmail}/>
        <Input type='password' value={password} setValue={setPassword}/>
        <Button 
          text='Sign in' 
          action={signIn}
          styles={{
            margin: '20px auto 0 auto'
          }}
        />
      </form>
    </div>
  )
}

export default SignIn