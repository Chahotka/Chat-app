import { useEffect, useState } from "react"
import { RoomUser } from "../../interfaces/RoomUser"
import { Message } from "../../interfaces/Message"
import { socket } from "../../socket/socket"
import { useDateConverter } from "./useDateConverter"
import { useAppSelector } from "../../app/hooks"

type LastMessage = {
  time: string
  userId: string
  message: string
}

export const useMessages = (room: RoomUser | null) => {
  const activeRoom = useAppSelector(state => state.user.activeRoom)
  const [messages, setMessages] = useState<Message[]>([])
  const [lastMessage, setLastMessage] = useState<LastMessage>({time: '', userId: '', message: ''})
  const { dateConverter } = useDateConverter()

  const getLastMessage = (messages: Message[]) => {
    if (messages.length > 0) {
      let time = ''
      const lastMessage = messages[messages.length - 1]
      const dateObj = dateConverter(lastMessage.createdAt)
  
      if (dateObj.day === dateObj.curDay) {
        time = `${dateObj.hh}:${dateObj.mm}`
      } else {
        time = dateObj.day
      }

      setLastMessage({
        time,
        userId: lastMessage.userId,
        message: lastMessage.textOrPath
      })
    } else {
      setLastMessage({
        time: '',
        userId: '',
        message: 'no messages'
      })
    }
  }

  const onHistory = (messages: Message[], roomId: string, socketId: string) => {
    if (room && room.roomId === roomId && socket.id === socketId && messages.length > 0) {
      getLastMessage(messages)
      sessionStorage.setItem(roomId, JSON.stringify(messages))
    } else if (room && room.roomId === roomId && socket.id === socketId && messages.length === 0) {
      setMessages(messages)
      getLastMessage(messages)
      sessionStorage.setItem(roomId, JSON.stringify(messages))
    }
  }

  useEffect(() => {
    if (room) {
      const storedMessages = sessionStorage.getItem(room.roomId)

      if (typeof storedMessages !== 'string') {
        socket.emit('get messages', room.roomId)
      } else {
        const parsedMessages = JSON.parse(storedMessages)

        getLastMessage(parsedMessages)
      }
    }
  
    socket.on('messages history', onHistory)

    return () => {
      socket.off('messages history', onHistory)
    }
  }, [room])

  useEffect(() => {
    if (activeRoom && activeRoom.roomId) {
      const storedMessages = sessionStorage.getItem(activeRoom.roomId)

      if (typeof storedMessages === 'string') {
        const parsedMessages = JSON.parse(storedMessages)

        setMessages(parsedMessages)
      }
    }
  }, [activeRoom])

  return { messages, setMessages, lastMessage }
}