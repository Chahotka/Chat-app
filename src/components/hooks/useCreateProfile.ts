import { useEffect } from 'react'
import { UserDataInterface } from '../../interfaces/UserDataInterface'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { changeEmail, changeNick, changePassword } from '../../features/user/UserSlice'
import { v4 } from 'uuid'

export const useCreateProfile = (
  nick: string, 
  email: string,
  password: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const dispatch = useAppDispatch()

  const nickCheck = (nick: string) => {
    const regEx = /^[\w-.$]+/i

    if (nick.length < 4) {
      setError('Nick is too short')
      return false
    }
    if (nick.length > 20) {
      setError('Nick is too long')
      return false
    }
    if (!regEx.test(nick)) {
      setError(`Don't use special `)
      return false
    }

    dispatch(changeNick(nick))
    return true
  }

  const emailCheck = (email: string) => {
    const regEx = /^[\w-.]+@[\w]+.[a-z]{2,4}$/i

    if (!regEx.test(email)) {
      setError('Email is incorrect')
      return false
    }

    dispatch(changeEmail(email))
    return true
  }

  const passwordCheck = (password: string) => {
    const regEx = /(?=.*\d+)/
    const regEx2 = /(?=.*[a-z]+)/i

    if (password.length < 5) {
      setError('Password is too short')
      return false
    }
    if (!regEx.test(password)) {
      setError('Password must contain numbers')
      return false
    }
    if (!regEx2.test(password)) {
      setError('Password must contain letters')
      return false
    }

    dispatch(changePassword(password))
    return true
  }

  const validateProfile = (nick: string, email: string, password: string) => {
    if (
      !nickCheck(nick) ||
      !emailCheck(email) ||
      !passwordCheck(password)
    ) {
      return false
    }

    setError('')
    return true
  }
  
  const onSend = (e: React.PointerEvent) => {
    e.preventDefault()

    if (!validateProfile(nick, email, password)) {
      return
    }
  }

  return { onSend }
}