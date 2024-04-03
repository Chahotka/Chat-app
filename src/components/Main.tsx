import React, { useEffect, useState } from 'react'
import cl from '../styles/main.module.css'
import Rooms from './Rooms'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { UserState, setProfile } from '../features/user/UserSlice'
import { useResizer } from './hooks/useResizer'
import { socket } from '../socket/socket'

const Main: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [active, setActive] = useState(socket.connected)
  const { resizing, setResizing, roomsWidth, grid, onMove } = useResizer()

  useEffect(() => {
    console.log('main re-rendering')
    socket.connect()
    const storedUser = sessionStorage.getItem('user')

    if (typeof storedUser === 'string') {
      const parsedUser: UserState = JSON.parse(storedUser)
      dispatch(setProfile(parsedUser))
    } else {
      navigate('/auth')
    }

    socket.on('connect', () => {
      setActive(socket.connected)
    })
    socket.on('disconnect', () => {
      setActive(socket.connected)
    })
    socket.on('connect_error', () => {
      setActive(socket.connected)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
    }
  }, [])

  return (
    <div
      className={resizing ? [cl.main, cl.resize].join(' ') : cl.main}
      style={{
        gridTemplateColumns: grid
      }}
      onMouseUp={() => setResizing(false)}
      onMouseMove={(e) => onMove(e)}
    >
      <div className={cl.statusDiv}>
        <span className={cl.socketId}>
          {socket.id
            ? `ID: ${socket.id}`
            : 'socket_offline'
          }
        </span>
        <span
          className={active
            ? [cl.status, cl.active].join(' ')
            : cl.status
          }
        ></span>
      </div>
      <Rooms width={roomsWidth} setActive={setResizing} />
      <Outlet />
    </div>
  )
}

export default Main


