import React, { useEffect, useRef, useState } from 'react'
import cl from '../../styles/chat.module.css'
import MessageSender from './Chat/MessageSender'
import Messages from './Chat/Messages'
import { Message } from '../../interfaces/Message'
import { socket } from '../../socket/socket'



const Chat: React.FC = () => {
  const bottomRef = useRef<HTMLLIElement>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const onMessages = (messages: Message[]) => {
    setMessages(messages)
  }

  useEffect(() => {
    socket.on('received messages', onMessages)

    return () => {
      socket.off('received messages', onMessages)
    }
  }, [])

  return (
    <div className={cl.chat}>
      <Messages bottomRef={bottomRef} messages={messages} />
      <MessageSender bottomRef={bottomRef} setMessages={setMessages} />
    </div>
  )
}

export default Chat