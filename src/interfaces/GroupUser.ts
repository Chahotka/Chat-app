import { Message } from "./Message"

type User = {
  role?: 'creator'
  id: string
  name: string
  email: string
  avatar: string
  activityStatus: string | number
}

export interface GroupUser {
  type: 'group'
  name: string
  avatar: string
  roomId: string
  creator: string
  users: User[]
  messages: Message[]
}