import { Dispatch, SetStateAction } from 'react'

export interface Auth {
  auth: boolean,
  setAuth: Dispatch<SetStateAction<boolean>>
}