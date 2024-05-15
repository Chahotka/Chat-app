import React, { useEffect } from 'react'
import cl from '../../styles/room.module.css'
import Chat from './Chat'
import RoomInfo from './RoomInfo'
import { useAppSelector } from '../../app/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import CallRoom from './Chat/Call/CallRoom'
import { useWebRTC } from '../hooks/useWebRTC'

const Room: React.FC = () => {
  const navigate = useNavigate()
  const room = useAppSelector(state => state.user.activeRoom)
  const { roomId } = useParams()

  const {
    clients,
    caller,
    callState,
    isSharing,
    setIsSharing,
    localCameraStream,
    peerMediaElements,
    startCall,
    stopCall,
    shareScreen,
    askPermission,
    provideMediaRef
  } = useWebRTC(roomId)

  useEffect(() => {
    if (!room) {
      navigate('/')
    }
    
  }, [room])

  return (
    <div className={cl.room}>
      <Chat askPermission={askPermission}/>
      <RoomInfo />
      {
        callState !== 'idle' &&
        <CallRoom
          clients={clients}
          caller={caller}
          callState={callState}
          isSharing={isSharing}
          setIsSharing={setIsSharing}
          localStream={localCameraStream}
          mediaElements={peerMediaElements}
          startCall={startCall}
          stopCall={stopCall}
          shareScreen={shareScreen}
          provideMediaRef={provideMediaRef}
        />
      }
    </div>
  )
}

export default Room