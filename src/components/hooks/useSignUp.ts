import { useAppSelector } from '../../app/hooks'
import { useHash } from './useHash'
import { useBlob64 } from './useBlob64'
import { useNavigate } from 'react-router-dom'

export const useSignUp = (
  valid: boolean,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const user = useAppSelector(state => state.user)
  const navigate = useNavigate()
  const { salt, hash } = useHash(user.password)
  const avatarBlob = useBlob64(user.avatar)

  
  const signUp = async (e: React.MouseEvent) => {
    e.preventDefault()
    const response = await fetch('http://localhost:5000/check-exist', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({email: user.email})
    })
    const userExist = await response.json()
    
    if (!valid) {
      setError('Fill your profile')
      return
    } else if (userExist) {
      setError('User already exist')
      return
    }


    await fetch('http://localhost:5000/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        salt,
        hash
      })
    })
  }

  return signUp
}