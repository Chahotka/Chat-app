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
  const ref = useRef<HTMLTextAreaElement>(null)

  const areaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    e.target.style.height = '29px'
    const scHeight = e.target.scrollHeight
    e.target.style.height = `${scHeight}px`
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }


  const onSend = () => {
    if (!user.activeRoom) {
      return
    } else if (message.trim().length === 0) {
      setMessage('')
      return
    }

    const date = Date.now()

    const messageObject: Message = {
      messageId: v4(),
      messageType: 'text',
      textOrPath: message.trim(),
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
      socket.off('message sended', onMessage)
    }
  }, [])

  useEffect(() => {
    if (message.trim().length === 0 && ref.current) {
      ref.current.style.height = '29px'
      const scHeight = ref.current.scrollHeight
      ref.current.style.height = `${scHeight}px`
    }
  }, [message])


  return (
    <div
      className={cl.sender}
    >
      <textarea
        ref={ref}
        value={message}
        className={cl.textarea}
        onChange={(e) => areaChange(e)}
        onKeyDown={(e) => onKeyDown(e)}
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