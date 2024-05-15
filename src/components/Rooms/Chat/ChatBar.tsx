import cl from '../../../styles/chat-bar.module.css'
import callImg from '../../../images/phone.svg'
import { RoomUser } from '../../../interfaces/RoomUser'
import { GroupUser } from '../../../interfaces/GroupUser'

interface Props {
  room: RoomUser | GroupUser
  askPermission: () => void
}

const ChatBar: React.FC<Props> = ({ room, askPermission }) => {
  return (
    <div className={cl.bar}>
      <div className={cl.info}>
        <p>{ room.name }</p>
        {room.type === 'direct' && <p>Last seen: yesterday</p>}
      </div>
      <div className={cl.actions}>
        <img
          className={cl.call}
          src={callImg}
          alt="Make call"
          onClick={askPermission}
        />
      </div>
    </div>
  )
}


export default ChatBar