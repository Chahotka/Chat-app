import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useFetch } from './useFetch'
import { useEmailExist } from './useEmailExist'
import { setProfile } from '../../features/user/UserSlice'
import { authorize } from '../../features/auth/AuthSlice'
import { useNavigate } from 'react-router-dom'

export const useSignIn = (
  valid: boolean,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const checkEmail = useEmailExist(user.email)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    if (signed) {
      navigate('/')
    }
  }, [signed])

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }
  const { loading, fetching } = useFetch(async () => {
    const emailInUse = await checkEmail()

    if (!emailInUse) {
      setMessage('Email or password are wrong')
      setSigned(false)
    }

    const response = await fetch('http://localhost:5000/sign-in', fetchOptions)
    const userData = await response.json()

    if (userData) {
      dispatch(setProfile(userData))
      dispatch(authorize())
      setSigned(true)
    } else {
      setMessage('Email or password are wrong')
      setSigned(false)
    }
  }, setMessage)

  const signIn = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!valid) {
      setMessage('Fill your profile')
      return
    }

    await fetching()
  }

  return { signIn, loading }
}