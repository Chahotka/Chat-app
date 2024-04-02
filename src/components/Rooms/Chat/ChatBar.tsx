import cl from '../../../styles/chat-bar.module.css'
import callImg from '../../../images/phone.svg'
import { RoomUser } from '../../../interfaces/RoomUser'
import { useWebRTC } from '../../hooks/useWebRTC'
import CallRoom from './Call/CallRoom'

interface Props {
  room: RoomUser
}

const ChatBar: React.FC<Props> = ({ room }) => {
  const { clients, call, callState, setCallState, provideMediaRef } = useWebRTC(room.roomId)

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
          provideMediaRef={provideMediaRef}
        />
      }
    </div>
  )
}


export default ChatBar