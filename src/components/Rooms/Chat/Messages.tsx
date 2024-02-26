import React, { useEffect, useRef } from 'react'
import cl from '../../../styles/messages.module.css'
import { Message } from '../../../interfaces/Message'
import { useAppSelector } from '../../../app/hooks'

interface Props {
  messages: Message[]
}

const Messages: React.FC<Props> = ({  messages }) => {
  const user = useAppSelector(state => state.user)
  const bottomRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({behavior: 'auto'})
    }
  }, [messages])
  
  return (
    <div className={cl.container}>
      <ul className={cl.messages}>
        {messages.map(message => {
          const owner = message.userId === user.id
          const date = new Date(message.createdAt)
          const dateObj = {
            hh: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
            mm: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
          }

          return (
            <li 
              key={message.messageId}
              className={owner ? [cl.message, cl.owner].join(' ') : cl.message}
            >
              <p className={cl.messageText}>{message.textOrPath}</p>
              <p className={cl.messageTime}>{`${dateObj.hh}:${dateObj.mm}`}</p>
            </li>
          )
        })}
        <li className={cl.bottom} ref={bottomRef}></li>
      </ul>
    </div>
  )
}

export default Messages