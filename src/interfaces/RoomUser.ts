import { Message } from "./Message"

export interface RoomUser {
  type: 'direct'
  id: string
  name: string
  email: string
  avatar: string
  roomId: string
  messages: Message[]
  activityStatus: string | number
}