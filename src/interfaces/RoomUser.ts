import { Message } from "./Message"

export interface RoomUser {
  id: string
  name: string
  email: string
  avatar: string
  roomId: string
  messages: Message[]
  activityStatus: string | number
}