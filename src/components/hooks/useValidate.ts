import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { changeEmail, changeIsValid, changeNick, changePassword } from '../../features/user/UserSlice'

export const useValidate = (
  type: 'sign-in' | 'sign-up',
  nick: string,
  email: string,
  password: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const dispatch = useAppDispatch()
  const [isValid, setIsValid] = useState(false)
  
  const nickCheck = (nick: string) => {
    const regEx = /^[\w-.$]+/i
    dispatch(changeNick(nick))

    if (nick.length < 4) {
      setError('Nick is too short')
      return 
    } else if (nick.length > 20) {
      setError('Nick is too long')
      return 
    } else if (!regEx.test(nick)) {
      setError(`Don't use special `)
      return 
    }

    return true
  }

  const emailCheck = (email: string) => {
    const regEx = /^[\w-.]+@[\w]+\.[a-z]{2,4}$/i
    dispatch(changeEmail(email))

    if (!regEx.test(email)) {
      setError('Email is incorrect')
      return 
    }

    return true
  }

  const passwordCheck = (password: string) => {
    const regEx = /(?=.*\d+)/
    const regEx2 = /(?=.*[a-z]+)/i

    dispatch(changePassword(nick))

    if (password.length < 5) {
      setError('Password is too short')
      return
    }
    if (!regEx.test(password)) {
      setError('Password must contain numbers')
      return
    }
    if (!regEx2.test(password)) {
      setError('Password must contain letters')
      return
    }

    return true
  }

  const validateProfile = () => {
    if (
      !nickCheck(nick) ||
      !emailCheck(email) ||
      !passwordCheck(password)
    ) {
      dispatch(changeIsValid(false))
      return
    }

    setError('')
    dispatch(changeIsValid(true))
  }

  useEffect(() => {
    if (type === 'sign-up' && (nick || email || password)) {
      validateProfile()
    }
  }, [nick, email, password])
}