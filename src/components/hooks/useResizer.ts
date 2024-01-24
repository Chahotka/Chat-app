import { useState } from "react"

export const useResizer = () => {
  const [resizing, setResizing] = useState(false)
  const [roomsWidth, setRoomsWidth] = useState(300)
  const [grid, setGrid] = useState(`minmax(200px, 300px) minmax(400px, 1fr)`)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!resizing) {
      return
    }

    if (e.clientX > window.innerWidth - 400) {
      setRoomsWidth(window.innerWidth - 400)
    } else if (e.clientX < 200) {
      setRoomsWidth(200)
    } else {
      setRoomsWidth(e.clientX)
    }
    setGrid(`minmax(200px,${roomsWidth}px) minmax(400px, 1fr)`)
  }

  return {
    resizing, setResizing,
    roomsWidth, grid,
    onMove
  }
}