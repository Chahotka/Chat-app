import { Dispatch, SetStateAction } from 'react'

export interface Profile {
  name: string
  setName: Dispatch<SetStateAction<string>>
  pfp: string
  setPfp: Dispatch<SetStateAction<string>>
}