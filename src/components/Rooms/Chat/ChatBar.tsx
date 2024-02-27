import { useAppSelector } from '../../../app/hooks'
import cl from '../../../styles/chat-bar.module.css'

const ChatBar: React.FC = () => {
  const room = useAppSelector(state => state.user.activeRoom)
  
  if (!room) {
    return <div></div>
  }

  return (
    <div className={cl.bar}>
      <p>{ room.name }</p>
      <p>Last seen: yesterday</p>
  </div>
  )
}


export default ChatBar