import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../src/features/user/UserSlice'

const store = configureStore({
  reducer: {
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch