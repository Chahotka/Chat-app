import React, { useState } from 'react'
import cl from '../../../../styles/call-room.module.css'
import { CallPermission, CallState } from '../../../hooks/useWebRTC'
import Client from './Client'
import phone from '../../../../images/phone.svg'
import leon from '../../../../images/leon.mp4'
import { MediaElements } from '../../../../interfaces/MediaElements'
import { socket } from '../../../../socket/socket'

interface Props {
  localStream: React.MutableRefObject<MediaStream | null>
  mediaElements: React.MutableRefObject<MediaElements>
  caller: CallPermission | null
  clients: string[]
  callState: CallState
  setCallState: React.Dispatch<React.SetStateAction<CallState>>
  startCall: () => void
  stopCall: () => void
  provideMediaRef: Function
  
}

const CallRoom: React.FC<Props> = (
  { 
    localStream,
    mediaElements,
    clients,
    caller, 
    callState, 
    setCallState,
    startCall,
    stopCall, 
    provideMediaRef 
  }
) => {
  const [deafened, setDeafened] = useState(false)
  
  return (
  <div className={cl.callRoom}>
    { 
      callState === 'receiving' &&
      <div className={cl.callBg}>
        <video 
          loop 
          autoPlay 
          playsInline 
          src={leon} 
        />
      </div>
    }
    { 
      callState !== 'receiving' &&
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
    }
    <div className={cl.callOptions}>
      { 
        callState === 'inCall' &&
        <div onClick={stopCall} className={cl.endCall}>
          <img className={cl.phone} src={phone} alt='end call'/>
        </div>
      }
      {
        callState === 'calling' &&
        <div className={cl.connectingBox}>
          <p>Connecting</p>
          <div className={cl.connecting}>
            <div className={cl.dot}></div>
          </div>
        </div>
      }
      {
        callState === 'receiving' &&
        <div className={cl.receiving}>
          <p className={cl.callerName}> 
            <span>{ caller?.callerName }</span> Calling...
          </p>
          <div className={cl.receivingOptions}>
            <div 
              onClick={startCall} 
              className={[cl.endCall, cl.green].join(' ')}
            >
              <img className={cl.phone} src={phone} alt="accept call" />
            </div>
            <div onClick={stopCall} className={cl.endCall}>
              <img className={cl.phone} src={phone} alt="decline call" />
            </div>
          </div>
        </div>
      }
      { callState === 'disconnecting' && <p>Call ended</p>}
    </div>
  </div>
  )
}

export default CallRoom