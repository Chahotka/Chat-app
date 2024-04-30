import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomUser } from "../../interfaces/RoomUser";
import { GroupUser } from "../../interfaces/GroupUser";

export interface UserState {
  id: string
  name: string
  email: string
  avatar: string | null
  password: string
  activeRoom: RoomUser | GroupUser | null
  rooms: (RoomUser | GroupUser)[]
}

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  avatar: null,
  password: '',
  activeRoom: null,
  rooms: []
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.avatar = action.payload.avatar
      state.password = action.payload.password
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
    },
    addRoom: (state, action: PayloadAction<RoomUser | GroupUser>) => {
      state.rooms = [...state.rooms, action.payload]
    },
    addRooms: (state, action: PayloadAction<RoomUser[]>) => {
      state.rooms = action.payload
    },
    setActiveRoom: (state, action: PayloadAction<RoomUser | GroupUser | null>) => {
      if (action.payload) {
        state.activeRoom = action.payload
      } else {
        state.activeRoom = null
      }
    }
  }
})

export const {
  setProfile, 
  changeName, 
  changeEmail, 
  changeAvatar,
  changePassword,
  addRoom,
  addRooms,
  setActiveRoom
} = userSlice.actions

export default userSlice.reducer