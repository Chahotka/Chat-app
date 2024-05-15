import React from 'react'
import cl from '../../styles/chat.module.css'
import MessageSender from './Chat/MessageSender'
import Messages from './Chat/Messages'
import { useAppSelector } from '../../app/hooks'
import { useMessages } from '../hooks/useMessages'
import ChatBar from './Chat/ChatBar'

interface Props {
  startCall: () => void
  askPermission: () => void
}

const Chat: React.FC<Props> = ({ startCall, askPermission }) => {
  const activeRoom = useAppSelector(state => state.user.activeRoom)
  const { messages, setMessages } = useMessages(activeRoom)


  return (
    <div className={cl.chat}>
      { activeRoom && 
        <ChatBar 
          room={activeRoom} 
          startCall={startCall}
          askPermission={askPermission} 
        /> 
      }
      <Messages  messages={messages} />
      <MessageSender setMessages={setMessages} />
    </div>
  )
}

export default Chat