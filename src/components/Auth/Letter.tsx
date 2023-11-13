import React, { useEffect } from 'react'
import cl from '../../styles/sent.module.css'
import { useAppDispatch } from '../../app/hooks'
import { clearProfile } from '../../features/user/UserSlice'

const Letter: React.FC = () => {
  const dispath = useAppDispatch()

  useEffect(() => {
    dispath(clearProfile())
  }, [])

  return (
    <div className={cl.sent}>
      <p className={cl.text}>Confirmation letter has been sent</p>
      <p className={cl.subText}>Check your email</p>
    </div>
  )
}

export default Letter