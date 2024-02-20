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
  const [message, setMessage] = useState('')

  const areaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    e.target.style.height = '29px'
    const scHeight = e.target.scrollHeight
    e.target.style.height = `${scHeight}px`
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

    const storageMessages = sessionStorage.getItem(messageObject.roomId)

    if (typeof storageMessages === 'string') {
      const parsedMessages = JSON.parse(storageMessages)
      sessionStorage.setItem(messageObject.roomId, JSON.stringify([...parsedMessages, messageObject]))
    }
  }


  useEffect(() => {
    socket.on('message sended', onMessage)

    return () => {
      socket.on('message sended', onMessage)
    }
  }, [])


  return (
    <div 
      className={cl.sender}
    >
      <textarea 
        value={message}
        className={cl.textarea}
        onChange={(e) => areaChange(e)}
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