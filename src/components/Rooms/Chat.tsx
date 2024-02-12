import React, { useEffect, useRef, useState } from 'react'
import cl from '../../styles/chat.module.css'
import MessageSender from './Chat/MessageSender'
import Messages from './Chat/Messages'
import { Message } from '../../interfaces/Message'
import { socket } from '../../socket/socket'



const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])

  const onMessages = (messages: Message[], joinedSocketId: string) => {
    if (socket.id === joinedSocketId) {
      setMessages(messages)
    }
  }

  useEffect(() => {
    socket.on('received messages', onMessages)

    return () => {
      socket.off('received messages', onMessages)
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