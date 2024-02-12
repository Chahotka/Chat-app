import React, { LegacyRef, RefObject, useEffect, useRef, useState } from "react"
import cl from '../../../styles/message-sender.module.css'
import sendImg from '../../../images/send.svg'
import { useAppSelector } from "../../../app/hooks"
import { Message } from "../../../interfaces/Message"
import { v4 } from "uuid"
import { socket } from "../../../socket/socket"


interface Props {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const MessageSender: React.FC<Props> = ({ setMessages }) => {
  const user = useAppSelector(state => state.user)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = useState('')

  const textAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const onSend = () => {
    if (!user.activeRoom) {
      return
    } else if (!message) {
      return
    }

    const date =  Date.now()

    const messageObject: Message = {
      messageId: v4(),
      messageType: 'text',
      textOrPath: message,
      roomId: user.activeRoom.roomId,
      userId: user.id,
      userName: user.name,
      createdAt: date,
      updatedAt: null
    }

    setMessage('')
    socket.emit('send message', messageObject)
  }

  const onMessage = (messageObject: Message) => {
    setMessages(prev => [...prev, messageObject])

  }
  useEffect(() => {
    if (textarea && textarea.current) {
      const scrollHeight = textarea.current.scrollHeight
      textarea.current.style.height = scrollHeight + 'px'
    } 
  }, [message])

  useEffect(() => {
    socket.on('message sended', onMessage)

    return () => {
      socket.on('message sended', onMessage)
    }
  }, [])


  return (
    <div className={cl.sender}>
      <textarea 
        ref={textarea}
        value={message}
        className={cl.input}
        onChange={(e) => textAreaChange(e)}
        placeholder="Send message..."
      ></textarea>
      <img 
        className={cl.send} 
        src={sendImg} 
        onClick={onSend}
        alt="send" 
      />
    </div>

  )
}

export default MessageSender