import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  authorized: boolean
}

const initialState: AuthState = {
  authorized: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authorize: state => {
      state.authorized = true
    },
    deauthorize: state => {
      state.authorized = false
    }
  }
})

export const { authorize, deauthorize } = authSlice.actions

export default authSlice.reducer