import React, { useState } from 'react'
import cl from '../../styles/chat.module.css'
import { useAppSelector } from '../../app/hooks'
import MessageSender from './Chat/MessageSender'
import Messages from './Chat/Messages'
import { Message } from '../../interfaces/Message'



const Chat: React.FC = () => {
  const room = useAppSelector(state => state.user.activeRoom)
  const [messages, setMessages] = useState<Message[]>([
    {
      messageId: 'fadf-adfasf-afd',
      messageType: 'text',
      textOrPath: 'TextorPatch',
      roomId: '130901233',
      userId: 'asdf-adfs-',
      userName:'aeav',
      createdAt: 128318911,
      updatedAt: null
    }
  ])

  return (
    <div className={cl.chat}>
      <Messages messages={messages} />
      <MessageSender setMessages={setMessages} />
    </div>
  )
}

export default Chat