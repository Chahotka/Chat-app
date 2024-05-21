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
    groupChannels,
    createChannel,
    joinChannel,
    localCameraStream,
    peerMediaElements,
    startCall,
    stopCall,
    hideCam,
    shareScreen,
    askPermission,
    provideMediaRef
  } = useWebRTC(roomId, room?.type)

  useEffect(() => {
    if (!room) {
      navigate('/')
    }
  }, [room])

  return (
    <div className={cl.room}>
      <Chat startCall={startCall} askPermission={askPermission}/>
      <RoomInfo groupChannels={groupChannels} createChannel={createChannel} joinChannel={joinChannel} />
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
          hideCam={hideCam}
          shareScreen={shareScreen}
          provideMediaRef={provideMediaRef}
        />
      }
    </div>
  )
}

export default Room