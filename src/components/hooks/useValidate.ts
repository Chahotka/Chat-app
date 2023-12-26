import React from 'react'

export const useValidate = (
  email: string,
  password: string,
  setValid: React.Dispatch<React.SetStateAction<boolean>> | undefined,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  type: string,
  name?: string
) => {
  const nameCheck = (name: string | undefined) => {
    const regEx = /^[\w-.$]+/i

    if (typeof name === 'undefined') {
      return true
    }
  
    if (name.length === 0) {
      setMessage('')
      return false
    } else if (name.length < 4) {
      setMessage('name is too short')
      return false
    } else if (name.length > 20) {
      setMessage('name is too long')
      return false
    } else if (!regEx.test(name)) {
      setMessage(`Don't use special `)
      return false
    } else {
      setMessage('')
    }

    return true
  }

  const emailCheck = (email: string) => {
    const regEx = /^[\w-.]+@[\w]+\.[a-z]{2,4}$/i

    if (email.length === 0) {
      setMessage('')
      return false
    } else if (!regEx.test(email)) {
      setMessage('Email is incorrect')
      return false
    }

    setMessage('')
    return true
  }

  const passwordCheck = (password: string) => {
    const regEx = /(?=.*\d+)/
    const regEx2 = /(?=.*[a-z]+)/i


    if (password.length === 0) {
      setMessage('')
      return false
    } else if (type === 'sign-in') {
      return true
    } else if (password.length < 5) {
      setMessage('Password is too short')
      return false
    } else if (!regEx.test(password)) {
      setMessage('Password must contain numbers')
      return false
    } else if (!regEx2.test(password)) {
      setMessage('Password must contain letters')
      return false
    }

    setMessage('')
    return true
  }

  const validateProfile = () => {
    if (typeof setValid === 'undefined') {
      return
    }

    if (
      !nameCheck(name) ||
      !emailCheck(email) ||
      !passwordCheck(password)
    ) {
      setValid(false)
      return
    }

    setValid(true)
  }
  
  return { validateProfile }
}