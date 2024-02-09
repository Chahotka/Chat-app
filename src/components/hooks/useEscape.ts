import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setActiveRoom } from "../../features/user/UserSlice"

export const useEscape = () => {
  const dispatch = useAppDispatch()
  const [sidebarActive, setSidebarActive] = useState(false)
  const activeRoom = useAppSelector(state => state.user.activeRoom)

  const onEscape = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') {
      return
    }

    if (sidebarActive) {
      setSidebarActive(false)
    } else {
      dispatch(setActiveRoom(null))
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onEscape)

    return () => {
      window.removeEventListener('keydown', onEscape)

    }
  }, [sidebarActive, activeRoom])

  return { sidebarActive, setSidebarActive }
}