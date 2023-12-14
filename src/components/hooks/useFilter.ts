import React, { useEffect, useState } from "react";
import { RoomUser } from "../../interfaces/RoomUser";

export const useFilter = (
  name: string,
  users: RoomUser[]
) => {
  const [filteredUsers, setFilteredUsers] = useState<RoomUser[]>(users)

  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  useEffect(() => {
    if (name.length > 0) {
      setFilteredUsers(users.filter(user =>
          user.name.toLowerCase().includes(name.toLowerCase())
        ))
    } else {
      setFilteredUsers(users)
    }
  }, [name])

  return { filteredUsers }
}