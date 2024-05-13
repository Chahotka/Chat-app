import cl from '../../../styles/chat-bar.module.css'
import callImg from '../../../images/phone.svg'
import plusImg from '../../../images/plus.svg'
import { RoomUser } from '../../../interfaces/RoomUser'
import { GroupUser } from '../../../interfaces/GroupUser'

interface Props {
  room: RoomUser | GroupUser
  startCall: () => void
  askPermission: () => void
}

const ChatBar: React.FC<Props> = ({ room, startCall, askPermission }) => {
  return (
    <div className={cl.bar}>
      <div className={cl.info}>
        <p>{ room.name }</p>
        {room.type === 'direct' && <p>Last seen: yesterday</p>}
      </div>
      <div className={cl.actions}>
        <img
          alt="Make call"
          className={cl.call}
          onClick={room.type === 'direct' ? askPermission : startCall}
          src={room.type === 'direct' ? callImg : plusImg}
          title={room.type === 'direct'
            ? `Call ${room.name}`
            : 'Start Voice Channel'
          }
        />
      </div>
    </div>
  )
}


export default ChatBar