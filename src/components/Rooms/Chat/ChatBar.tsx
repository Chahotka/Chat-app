import cl from '../../../styles/chat-bar.module.css'
import callImg from '../../../images/phone.svg'
import { RoomUser } from '../../../interfaces/RoomUser'
import { useWebRTC } from '../../hooks/useWebRTC'
import CallRoom from './Call/CallRoom'
import { useEffect } from 'react'

interface Props {
  room: RoomUser
}

const ChatBar: React.FC<Props> = ({ room }) => {
  const { 
    clients, 
    call, 
    stopCall,
    callState, 
    setCallState, 
    provideMediaRef 
  } = useWebRTC(room.roomId)

  useEffect(() => {
    console.log('chat bar re-rendering')
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
          onClick={call}
        />
      </div>
      {
        callState !== 'idle' &&
        <CallRoom 
          callState={callState}
          setCallState={setCallState}
          clients={clients} 
          stopCall={stopCall}
          provideMediaRef={provideMediaRef}
        />
      }
    </div>
  )
}


export default ChatBar