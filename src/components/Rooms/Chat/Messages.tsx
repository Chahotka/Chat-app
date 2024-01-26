import React from 'react'
import cl from '../../../styles/messages.module.css'
import { Message } from '../../../interfaces/Message'
import { useAppSelector } from '../../../app/hooks'

interface Props {
  messages: Message[]
}

const Messages: React.FC<Props> = ({messages}) => {
  const user = useAppSelector(state => state.user)

  return (
    <div className={cl.container}>
      <ul className={cl.messages}>
        {messages.map(message => {
          const owner = message.userId === user.id
          const date = {
            hh: new Date(message.createdAt).getHours(),
            min: new Date(message.createdAt).getMinutes()
          }

          return (
            <li 
              key={message.messageId}
              className={owner ? [cl.message, cl.owner].join(' ') : cl.message}
            >
              {message.textOrPath}
              {`${date.hh}:${date.min}`}
            </li>
            )
        })}
    </ul>
    </div>
  )
}

export default Messages