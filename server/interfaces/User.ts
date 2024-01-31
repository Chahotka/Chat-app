export interface User {
  id: string
  name: string | null
  email: string
  avatar: string | null
  salt: number
  password: number
}