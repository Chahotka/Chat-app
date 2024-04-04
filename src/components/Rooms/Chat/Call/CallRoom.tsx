import React, { useState } from 'react'
import cl from '../../../../styles/call-room.module.css'
import { CallState } from '../../../hooks/useWebRTC'
import Client from './Client'
import phone from '../../../../images/phone.svg'
import { MediaElements } from '../../../../interfaces/MediaElements'

interface Props {
  localStream: React.MutableRefObject<MediaStream | null>
  mediaElements: React.MutableRefObject<MediaElements>
  clients: string[]
  callState: CallState
  stopCall: () => void
  provideMediaRef: Function
  
}

const CallRoom: React.FC<Props> = ({ localStream, mediaElements, clients, callState, stopCall, provideMediaRef }) => {
  const [deafened, setDeafened] = useState(false)
  
  return (
  <div className={cl.callRoom}>
    <ul className={cl.clients}>
      {clients.map(clientId => {
        return (
          <Client 
            key={clientId} 
            deafened={deafened}
            setDeafened={setDeafened}
            clientId={clientId} 
            provideRef={provideMediaRef}
            localStream={localStream}
            mediaElements={mediaElements}
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