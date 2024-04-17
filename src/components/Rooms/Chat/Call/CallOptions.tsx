import React from 'react'
import cl from '../../../../styles/call-room.module.css'
import { CallPermission, CallState } from '../../../hooks/useWebRTC'
import phone from '../../../../images/phone.svg'

interface Props {
  caller: CallPermission | undefined
  callState: CallState
  startCall: () => void
  stopCall: () => void
}

const CallOptions: React.FC<Props> = ({ caller, callState, startCall, stopCall}) => {
  return (
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
  )
}

export default CallOptions