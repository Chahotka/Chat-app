import React from 'react'
import cl from '../../styles/chat.module.css'
import MessageSender from './Chat/MessageSender'
import Messages from './Chat/Messages'
import { useAppSelector } from '../../app/hooks'
import { useMessages } from '../hooks/useMessages'
import ChatBar from './Chat/ChatBar'



const Chat: React.FC = () => {
  const activeRoom = useAppSelector(state => state.user.activeRoom)
  const { messages, setMessages } = useMessages(activeRoom)


  return (
    <div className={cl.chat}>
      <ChatBar />
      <Messages  messages={messages} />
      <MessageSender setMessages={setMessages} />
    </div>
  )
}

export default Chat