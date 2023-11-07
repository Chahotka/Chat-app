import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { dbHandler, storageHandler } from '../../firebase/firebase'
import { useHash } from './useHash'
import { useBlob64 } from './useBlob64'
import { useEmail } from './useEmail'
import { useNavigate } from 'react-router-dom'

export const useSignUp = (
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const user = useAppSelector(state => state.user)
  const navigate = useNavigate()
  const hashCode = useHash()
  const sendMail = useEmail(user.email, user.nick)
  const avatarBlob = useBlob64(user.avatar)

  const signUp = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user.isValid) {
      return
    }

    const isInUse = await dbHandler.getUser(user.email)
    if (isInUse) {
      setError('Email is in use')
      return
    }

    const hashed = hashCode(user.password)

    await storageHandler.addAvatar(user.nick, avatarBlob)
    const avatar = await storageHandler.getAvatar(user.nick)
    
    await dbHandler.addUser({
      id: user.id,
      nick: user.nick,
      salt: hashed.salt,
      email: user.email,
      avatar: avatar,
      password: hashed.hash,
      verificated: false
    })

    // await sendMail()
    navigate('/auth/letter-sent')
  }

  return signUp
}