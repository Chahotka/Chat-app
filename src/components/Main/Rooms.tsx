import React from 'react'
import cl from '../../styles/rooms.module.css'
import { RoomUser } from '../../interfaces/RoomUser'
import Room from './Room'

interface Props {
  users: RoomUser[]
}
// ДОписать cmp rooms и room
const Rooms: React.FC<Props> = ({users}) => {
  
  return (
    <div className={cl.rooms}>
      <ul className={cl.roomsList}>
        {users.map(user => 
            <Room user={user} key={user.name}/>
        )}
      </ul>
    </div>
  )
}

export default Rooms