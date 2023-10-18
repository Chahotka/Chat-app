import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

export interface UserState {
  id: string
  nick: string
  email: string
  avatar: string
  password: string
}
const initialState: UserState = {
  id: '',
  nick: '',
  email: '',
  avatar: '',
  password: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createProfile: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
    changeNick: (state, action: PayloadAction<string>) => {
      state.nick = action.payload
    },
    changeEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    changeAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload
    },
    changePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    }
  }
})

export const {
  createProfile, 
  changeNick, 
  changeEmail, 
  changeAvatar, 
  changePassword
} = userSlice.actions

export default userSlice.reducer