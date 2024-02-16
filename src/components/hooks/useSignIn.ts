import React from 'react'
import { useFetch } from './useFetch'
import { useEmailExist } from './useEmailExist'

export const useSignIn = (
  email: string,
  password: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const checkEmail = useEmailExist(email)
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  }

  const { loading, fetching } = useFetch(async () => {
    const emailInUse = await checkEmail()

    if (!emailInUse) {
      setMessage('Email or password are wrong')
      return
    }

    const response = await fetch('http://localhost:5000/sign-in', fetchOptions)
    const userData = await response.json()

    if (userData) {
      sessionStorage.setItem('user', JSON.stringify(userData))
    } else {
      setMessage('Email or password are wrong')
    }
  }, setMessage)

  const signIn = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (email.length < 6 || password.length < 5) {
      setMessage('Fill your profile')
      return
    }

    await fetching()
  }

  return { signIn, loading }
}