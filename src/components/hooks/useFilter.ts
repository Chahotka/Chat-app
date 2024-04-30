import React, { useEffect, useState } from "react";
import { RoomUser } from "../../interfaces/RoomUser";
import { GroupUser } from "../../interfaces/GroupUser";

export const useFilter = (
  name: string,
  users: (RoomUser | GroupUser)[]
) => {
  const [filteredRooms, setFilteredRooms] = useState<(RoomUser | GroupUser)[]>(users)

  useEffect(() => {
    setFilteredRooms(users)
  }, [users])

  useEffect(() => {
    if (name.length > 0) {
      setFilteredRooms(users.filter(user =>
          user.name.toLowerCase().includes(name.toLowerCase())
        ))
    } else {
      setFilteredRooms(users)
    }
  }, [name])

  return { filteredRooms }
}