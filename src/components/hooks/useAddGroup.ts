import React, { useEffect, useState } from "react"
import { useFetch } from "./useFetch"
import { v4 } from "uuid"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addRoom } from "../../features/user/UserSlice"

type Return = {fetching: () => Promise<void>, loading: boolean, error: string, showError: boolean}
type Hook = (
  creatorId: string,
  selectedUsers: string[],
  groupName: string, 
  setActive: React.Dispatch<React.SetStateAction<boolean>>
) => Return

const fetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
}

export const useAddGroup: Hook = (creatorId, selectedUsers, groupName, setActive) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)

  const [error, setError] = useState('')
  const [showError, setShowError] = useState(true)

  const storageRooms = sessionStorage.getItem('rooms')

  const checkGroup = () => {
    if (groupName.length < 4) {
      setShowError(true)
      setError('Group name is too short')
      return true
    }

    return false
  }
  
  const { fetching, loading } = useFetch(async () => {
    setShowError(false)

    if (checkGroup()) {
      return
    }

    const response = await fetch('http://localhost:5000/create-group', {
      ...fetchOptions,
      body: JSON.stringify({
        groupId: v4(),
        creatorId,
        groupName,
        selectedUsers
      })
    })
    const data = await response.json()

    if (data.status === 'error') {
      setError(data.res)
      setShowError(true)
      return
    } else if (data.status === 'success') {
      dispatch(addRoom(data.res))

      if (typeof storageRooms === 'string') {
        const rooms = JSON.parse(storageRooms)
        sessionStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('rooms', JSON.stringify([...rooms, data.res]))
      }
    }
  }, setError)

  useEffect(() => {
    setShowError(false)
  }, [groupName])

  return { fetching, loading, error, showError }
}