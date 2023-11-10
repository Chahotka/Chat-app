import React from 'react'
import { dbHandler } from '../../firebase/firebase'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useHash } from './useHash'
import { DocumentData } from 'firebase/firestore'
import { authorize } from '../../features/Auth/AuthSlice'
import { setUserProfile } from '../../features/user/UserSlice'
import { useNavigate } from 'react-router-dom'

export const useSignIn = (
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const user = useAppSelector(state => state.user)
  const auth = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const hashed = useHash()
  

  const signIn = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user.isValid) {
      setError('Enter info')
      return
    }

    const response: DocumentData | false = await dbHandler.getUser(user.email)
    
    if (response) {
      if (hashed(user.password, response.salt).hash !== response.password) {
        setError('Invalid email or password')
        return
      } else if (!response.verificated) {
        setError('User is not verificated')
        return
      } else {
        dispatch(setUserProfile(response))
        dispatch(authorize())
      }
    } else {
      setError('Invalid email or password')
      return  
    }

    navigate('/')
  }

  console.log(user.isValid)
  return signIn
}