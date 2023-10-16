import React, { useState, useEffect } from 'react'
import cl from './form.module.css'
import Button from '../Button/Button'
import { useProfileContext } from '../../../context/ProfileContext'
import { UserDataInterface } from '../../../interfaces/UserDataInterface'
import { useAuthContext } from '../../../context/AuthContext'
import Input from '../Input/Input'

const Form: React.FC = () => {
  const [nick, setNick] = useState('')
  const [email, setEmail] = useState('')
  const [nickStyles, setNickStyles] = useState([cl.inputBox])
  const [emailStyles, setEmailStyles] = useState([cl.inputBox])

  const { setAuth } = useAuthContext()
  const { name, setName } = useProfileContext()

  
  const validateProfile = (nickname: string, email: string) => {
    const nickExp = /^[\w-.]+$/
    const emailExp = () => /^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(email)
    console.log(emailExp())

  }
  
  const onSend = (e: React.PointerEvent) => {
    e.preventDefault()

    console.log(validateProfile(nick, email))

    // setAuth(true)
    // setName(nickname)
    // sessionStorage.setItem('authorized', JSON.stringify(true))
  }

  useEffect(() => {
    if (name) {
      const userData: UserDataInterface = JSON.parse(sessionStorage['user data'])

      sessionStorage.setItem('user data', JSON.stringify({...userData, name: name}))
    }
  }, [name])


  return (
    <form className={cl.form} autoComplete='off'>
      <Input type='nick' />
      <Input type='email' />
      <Button 
        type='submit'
        text='save' 
        styles={{width: '99.9%', marginTop: '15px'}}
        action={(e: React.PointerEvent) => onSend(e)}
      />
    </form>
  )
}

export default Form