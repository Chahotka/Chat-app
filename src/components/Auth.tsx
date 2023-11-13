import React from 'react'
import cl from '../styles/auth.module.css'
import Button from './UI/Button/Button'
import { useNavigate } from 'react-router-dom'


const Auth: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className={cl.auth}>
      <div className={cl.btnBox}>
        <Button text='Sign in' action={() => navigate('/auth/sign-in')} />
        <Button text='Sign up' action={() => navigate('/auth/sign-up')} />
      </div>
    </div>
  )
}

export default Auth