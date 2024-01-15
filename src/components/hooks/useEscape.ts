import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { setActiveRoom } from "../../features/user/UserSlice"

export const useEscape = () => {
  const dispatch = useAppDispatch()
  const [sidebarActive, setSidebarActive] = useState(false)

  const onEscape = (e: KeyboardEvent) => {
    if (e.code !== 'Escape') {
      return
    }

    if (sidebarActive) {
      setSidebarActive(false)
      return
    }

    dispatch(setActiveRoom(null))
  }

  return {sidebarActive, setSidebarActive, onEscape}
}