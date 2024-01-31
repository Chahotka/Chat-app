import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/UserSlice'
import authReducer from '../features/auth/AuthSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch