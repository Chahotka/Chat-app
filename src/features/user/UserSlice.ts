import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: string | null
  name: string | null
  email: string | null
  avatar: string | null
  password: string | null
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  avatar: null,
  password: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserState>) => {
      state = action.payload
    },
    changeName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
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
  setProfile, 
  changeName, 
  changeEmail, 
  changeAvatar,
  changePassword
} = userSlice.actions

export default userSlice.reducer