import { Message } from "../../interfaces/Message"
import { useState, useEffect } from "react"
import { useDateConverter } from "./useDateConverter"
import { RoomUser } from "../../interfaces/RoomUser"
import { socket } from "../../socket/socket"

interface LastMessage {
  time: string
  userId: string
  message: string
}

export const useLastMessage = (room: RoomUser) => {
  const { dateConverter } = useDateConverter()
  const [lastMessage, setLastMessage] = useState<LastMessage>({
    time: '',
    userId: '',
    message: ''
  })

  const onLastMessage = (messages: Message[], roomId: string, socketId: string) => {
    if (
      socket.id === socketId &&
      roomId === room.roomId &&
      messages.length > 0
    ) {
      let messageTime = ''
      const lastMessage = messages[messages.length - 1]
      const dateObj = dateConverter(lastMessage.createdAt)

      if (dateObj.day === dateObj.curDay) {
        messageTime = `${dateObj.hh}:${dateObj.mm}`
      } else {
        messageTime = dateObj.day
      }

      setLastMessage({
        time: messageTime,
        userId: lastMessage.userId,
        message: lastMessage.textOrPath
      })
    }
  }

  useEffect(() => {
    const storedMessages = sessionStorage.getItem(room.roomId)

    if (
      typeof storedMessages === 'string' &&
      JSON.parse(storedMessages).length > 0
    ) {
      let messageTime = ''
      const parsedMessages: Message[] = JSON.parse(storedMessages)
      const lastMessage = parsedMessages[parsedMessages.length - 1]
      const dateObj = dateConverter(lastMessage.createdAt)

      if (dateObj.day === dateObj.curDay) {
        messageTime = `${dateObj.hh}:${dateObj.mm}`
      } else {
        messageTime = dateObj.day
      }

      setLastMessage({
        time: messageTime,
        userId: lastMessage.userId,
        message: lastMessage.textOrPath
      })

      return
    }

    socket.on('last message', onLastMessage)

    return () => {
      socket.off('last message', onLastMessage)
    }
  }, [])

  return { lastMessage }
}