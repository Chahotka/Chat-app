import React, { useEffect } from 'react'
import cl from '../../styles/room.module.css'
import Chat from './Chat'
import RoomInfo from './RoomInfo'
import { useAppSelector } from '../../app/hooks'
import { useNavigate } from 'react-router-dom'

const Room: React.FC = () => {
  const navigate = useNavigate()
  const room = useAppSelector(state => state.user.activeRoom)

  useEffect(() => {
    if (!room) {
      navigate('/')
    }
    
  }, [room])

  return (
    <div className={cl.room}>
      <Chat />
      <RoomInfo />
    </div>
  )
}

export default Room