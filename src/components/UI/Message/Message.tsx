import React, { useState, useEffect } from 'react'
import cl from './message.module.css'
import { useNavigate } from 'react-router-dom'

interface Props {
  message: string
}

const Message: React.FC<Props> = ({ message }) => {
  const navigate = useNavigate()
  const [showLink, setShowLink] = useState(false)
  const [messageStyles, setMessageStyles] = useState([cl.message, cl.error])

  useEffect(() => {
    if (message === 'User already exist') {
      setShowLink(true)
      setMessageStyles([cl.message, cl.error])
    } else if (message === 'User created successfully') {
      setShowLink(true)
      setMessageStyles([cl.message, cl.success])
    } else {
      setShowLink(false)
      setMessageStyles([cl.message, cl.error])
    }
  }, [message])

  return (
    <div className={cl.messageBox}>
      <p
        className={messageStyles.join(' ')}
      >
        { message } 
        { showLink && 
          <span 
            className={cl.link}
            onClick={() => navigate('/auth/sign-in')}
          >
            Sign In?
          </span> 
        }
      </p>
    </div>
  )
}

export default Message