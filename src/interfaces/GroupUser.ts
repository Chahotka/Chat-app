import { Message } from "./Message"

export interface GroupUser {
  type: 'group'
  name: string
  avatar: string
  roomId: string
  users: {
    [key: string]: {
      role?: 'creator'
      id: string
      name: string
      email: string
      avatar: string
      activityStatus: string | number
    }
  }
  messages: Message[]
}