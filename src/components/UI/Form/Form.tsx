import React, { useState, useEffect } from 'react'
import cl from './form.module.css'
import Button from '../Button/Button'
import { useProfileContext } from '../../../context/ProfileContext'
import { UserDataInterface } from '../../../interfaces/UserDataInterface'
import { useAuthContext } from '../../../context/AuthContext'

const Form: React.FC = () => {
  const [nickname, setNickname] = useState('')

  const { setAuth } = useAuthContext()
  const { name, setName } = useProfileContext()

  const onSend = (e: React.PointerEvent) => {
    e.preventDefault()
    if (nickname.length < 2 || nickname.length > 20) {
      return
    }

    setAuth(true)
    setName(nickname)
  }

  useEffect(() => {
    if (name) {
      const userData: UserDataInterface = JSON.parse(sessionStorage['user data'])

      sessionStorage.setItem('user data', JSON.stringify({...userData, name: name}))
    }
  }, [name])


  return (
    <form className={cl.form}>
      <input 
        className={cl.input} 
        value={nickname}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
        type="text"  
        placeholder='Enter your nickname'
      />
      <Button 
        text='save' 
        action={(e: React.PointerEvent) => onSend(e)}
      />
    </form>
  )
}

export default Form