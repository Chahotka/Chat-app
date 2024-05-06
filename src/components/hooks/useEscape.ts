import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setActiveRoom } from "../../features/user/UserSlice"
import { socket } from "../../socket/socket"

type Hook = (
  showGroup: boolean,
  showDirect: boolean,
  setShowGroup: React.Dispatch<React.SetStateAction<boolean>>,
  setShowDirect: React.Dispatch<React.SetStateAction<boolean>>

) => {
  sidebarActive: boolean
  setSidebarActive: React.Dispatch<React.SetStateAction<boolean>>
}

export const useEscape: Hook = (showGroup, showDirect, setShowGroup, setShowDirect) => {
  const dispatch = useAppDispatch()
  const [sidebarActive, setSidebarActive] = useState(false)
  const activeRoom = useAppSelector(state => state.user.activeRoom)

  const onEscape = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') {
      return
    }

    if (showDirect) {
      setShowDirect(false)
    } else if (showGroup) {
      setShowGroup(false)
    } else if (sidebarActive) {
      setSidebarActive(false)
    } else if (activeRoom) {
      socket.emit('leave', activeRoom.roomId)
      dispatch(setActiveRoom(null))
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onEscape)

    return () => {
      window.removeEventListener('keydown', onEscape)

    }
  }, [sidebarActive, activeRoom, showDirect, showGroup])

  return { sidebarActive, setSidebarActive }
}