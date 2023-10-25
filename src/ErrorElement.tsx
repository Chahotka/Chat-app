import React from 'react'
import cl from './styles/error.module.css'
import { useError } from './components/hooks/useError'

const ErrorElement: React.FC = () => {
  const message  = useError()

  console.log(message)

  return (
    <div className={cl.error}>
      { message }
    </div>
  )
}

export default ErrorElement