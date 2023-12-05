import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { changeEmail, changeName, changePassword } from '../../features/user/UserSlice'

export const useValidate = (
  name: string,
  email: string,
  password: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
  const dispatch = useAppDispatch()
  
  const nameCheck = (name: string) => {
    const regEx = /^[\w-.$]+/i
    dispatch(changeName(name))

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
    dispatch(changeEmail(email))

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

    dispatch(changePassword(password))

    if (password.length === 0) {
      setMessage('')
      return false
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

  const validateProfile = (
    setValid: React.Dispatch<React.SetStateAction<boolean>> | undefined
  ) => {
    if (!setValid) {
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