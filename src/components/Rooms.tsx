import React, { useState } from 'react'
import cl from '../styles/rooms.module.css'
import { RoomUser } from '../interfaces/RoomUser'
import Room from './Rooms/Room'
import Sidebar from './Rooms/Sidebar'
import { useFilter } from './hooks/useFilter'
import AddRoom from './Rooms/AddRoom'

interface Props {
  users: RoomUser[]
}

const Rooms: React.FC<Props> = ({ users }) => {
  const [name, setName] = useState('')
  const { filteredUsers } = useFilter(name, users)

  return (
    <div className={cl.rooms}>
      <Sidebar name={name} setName={setName} />
      <AddRoom />
      { users.length > 0 &&
        <ul className={cl.roomsList}>
          {filteredUsers.map(user =>
            <Room user={user} key={user.id} />
          )}
        </ul>
      }
    </div>
  )
}

export default Rooms