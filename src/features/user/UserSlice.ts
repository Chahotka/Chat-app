import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  id: string
  nick: string
  email: string
  avatar: string
  password: string
  verificated: boolean
}
const initialState: UserState = {
  id: '',
  nick: '',
  email: '',
  avatar: '',
  password: '',
  verificated: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUserProfile: (state, action: PayloadAction<UserState>) => {
      state = action.payload
    },
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
    },
    changeVerificated: (state, action: PayloadAction<boolean>) => {
      state.verificated = action.payload
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