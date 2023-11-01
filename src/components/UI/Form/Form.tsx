import React, { useState, useRef } from 'react'
import cl from './form.module.css'
import Button from '../Button/Button'
import Input from '../Input/Input'
import { useCreateProfile } from '../../hooks/useCreateProfile'
import { useAppSelector } from '../../../app/hooks'

const Form: React.FC = () => {
  const user = useAppSelector(state => state.user)

  const [nick, setNick] = useState(user.nick)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState(user.password)

  const { onSend, error } = useCreateProfile(nick, email, password)
  
  
  return (
    <>
      <form className={cl.form} autoComplete='off'>
        <p className={cl.error}>{ error }</p>
        <Input type='nick' value={nick} setValue={setNick} />
        <Input type='email' value={email} setValue={setEmail} />
        <Input type='password' value={password} setValue={setPassword} />
        <Button 
          type='submit'
          text='save'
          styles={{marginTop: '20px'}}
          action={(e: React.PointerEvent) => onSend(e)}
        />
      </form>
    </>
  )
}

export default Form