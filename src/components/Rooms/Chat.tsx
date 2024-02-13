import React, { useEffect, useState } from 'react'
import cl from '../../styles/chat.module.css'
import MessageSender from './Chat/MessageSender'
import Messages from './Chat/Messages'
import { Message } from '../../interfaces/Message'
import { useAppSelector } from '../../app/hooks'



const Chat: React.FC = () => {
  const activeRoom = useAppSelector(state => state.user.activeRoom)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (activeRoom) {
      const storedMessages = sessionStorage.getItem(activeRoom.roomId)

      if (typeof storedMessages === 'string') {
        const messages = JSON.parse(storedMessages)

        setMessages(messages)
      }
    }
  }, [])

  return (
    <div className={cl.chat}>
      <Messages  messages={messages} />
      <MessageSender setMessages={setMessages} />
    </div>
  )
}

export default Chat