import React, { useEffect } from 'react'
import cl from '../../styles/room.module.css'
import Chat from './Chat'
import RoomInfo from './RoomInfo'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useNavigate } from 'react-router-dom'
import { setActiveRoom } from '../../features/user/UserSlice'

const Room: React.FC = () => {
  const room = useAppSelector(state => state.user.activeRoom)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      dispatch(setActiveRoom(null))
      e.key === 'Escape' && navigate('/')
    } 

    window.addEventListener('keydown', onEscape)

    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  return (
    <div className={cl.room}>
      <Chat />
      <RoomInfo />
    </div>
  )
}

export default Room