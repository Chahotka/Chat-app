import cl from '../../../styles/chat-bar.module.css'
import callImg from '../../../images/phone.svg'
import { RoomUser } from '../../../interfaces/RoomUser'
import { useWebRTC } from '../../hooks/useWebRTC'
import CallRoom from './Call/CallRoom'
import { useEffect, useRef } from 'react'
import { socket } from '../../../socket/socket'
import { ACTIONS } from '../../../modules/Actions'
import { GroupUser } from '../../../interfaces/GroupUser'

interface Props {
  room: RoomUser | GroupUser
}

const ChatBar: React.FC<Props> = ({ room }) => {
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
  } = useWebRTC(room.roomId)
  
  useEffect(() => {
    return () => {
      socket.emit(ACTIONS.STOP_CALL)
    }
  }, [])

  return (
    <div className={cl.bar}>
      <div className={cl.info}>
        <p>{ room.name }</p>
        <p>Last seen: yesterday</p>
      </div>
      <div className={cl.actions}>
        <img
          className={cl.call}
          src={callImg}
          alt="Make call"
          onClick={askPermission}
        />
      </div>
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


export default ChatBar