export interface Message {
  messageId: string
  messageType: string
  textOrPath: string
  roomId: string
  userId: string
  userName: string
  createdAt: number
  updatedAt: number | null
}