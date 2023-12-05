import React, { useEffect, useState } from 'react'
import cl from './form.module.css'
import Button from '../Button/Button'
import Input from '../Input/Input'
import { useAppSelector } from '../../../app/hooks'
import { useValidate } from '../../hooks/useValidate'
import Message from '../Message/Message'

interface Props {
  message: string,
  setValid?: React.Dispatch<React.SetStateAction<boolean>> 
  setMessage: React.Dispatch<React.SetStateAction<string>> 
  type: 'sign-in' | 'sign-up'
  btnAction: React.MouseEventHandler
}

const Form: React.FC<Props> = ({ 
  setValid,
  message,
  setMessage,
  type,
  btnAction
}) => {
  const user = useAppSelector(state => state.user)
  const [name, setNick] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [password, setPassword] = useState(user.password || '')
  const { validateProfile } = useValidate(name, email, password, setMessage)

  useEffect(() => {
    validateProfile(setValid)
  }, [name, email, password])

  return (
    <>
      <form className={cl.form} autoComplete='off'>
        <Message message={message} />
        { type === 'sign-up' &&
          <Input type='name' value={name} setValue={setNick} />
        }
        <Input type='email' value={email} setValue={setEmail} />
        <Input type='password' value={password} setValue={setPassword} />
        <Button 
          type='submit'
          text='save'
          action={btnAction}
        />
      </form>
    </>
  )
}

export default Form