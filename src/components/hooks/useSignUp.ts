import { useAppSelector } from '../../app/hooks'
import { useEmailExist } from './useEmailExist'
import { useFetch } from './useFetch'
import { useHash } from './useHash'

export const useSignUp = (
  valid: boolean,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const user = useAppSelector(state => state.user)
  const { salt, hash } = useHash(user.password)
  const chekcEmail = useEmailExist(user.email)
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...user,
      salt,
      password: hash
    })
  }

  const { loading, fetching } = useFetch(async () => {
    const emailInUse = await chekcEmail()
    if (emailInUse) {
      setMessage('User already exist')
      return
    }

    const response = await fetch('http://localhost:5000/sign-up', fetchOptions)
    const userAdded = await response.json()

    if (userAdded) {
      setMessage('User created successfully')
    }
  }, setMessage)

  
  const signUp = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!valid) {
      setMessage('Fill your profile')
      return
    }

    await fetching()
  }

  return {signUp, loading}
}