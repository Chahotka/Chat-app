import React from 'react'
import cl from '../../../../styles/call-room.module.css'
import { CallState } from '../../../hooks/useWebRTC'
import Client from './Client'
import phone from '../../../../images/phone.svg'

interface Props {
  clients: string[]
  callState: CallState
  stopCall: () => void
  setCallState: React.Dispatch<React.SetStateAction<CallState>>
  provideMediaRef: Function
  
}

const CallRoom: React.FC<Props> = ({ clients, callState, stopCall, setCallState, provideMediaRef }) => {
  return (
  <div className={cl.callRoom}>
    <ul className={cl.clients}>
      {clients.map(clientId => {
        return (
          <Client 
            key={clientId} 
            clientId={clientId} 
            provideRef={provideMediaRef}
          />
        )
      })}
    </ul>
    <div className={cl.callOptions}>
      { 
        callState === 'inCall' &&
        <div onClick={stopCall} className={cl.endCall}>
          <img className={cl.phone} src={phone} alt='end call'/>
        </div>
      }
      {
        callState === 'calling' &&
        <div className={cl.connecting}>
          <div className={cl.dot}></div>
        </div>
      }
      { callState === 'disconnecting' && <p>Call ended</p>}
    </div>
  </div>
  )
}

export default CallRoom