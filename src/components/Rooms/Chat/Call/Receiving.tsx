import React from 'react'
import cl from '../../../../styles/call-room.module.css'
import phone from '../../../../images/phone.svg'
import callBg from '../../../../images/Chahotka.mp4'
import { CallPermission } from '../../../hooks/useWebRTC'

interface Props {
  caller: CallPermission | undefined
  startCall: () => void
  stopCall: () => void
}

const Receiving: React.FC<Props> = ({ caller, stopCall, startCall }) => {
  return (
    <div className={cl.receiving}>
      <video className={cl.receivingBg} autoPlay playsInline loop src={callBg}></video>
      <div className={cl.caller}>
        <p className={cl.callerName}>{caller?.callerName} calling...</p>
      </div>
      <div className={cl.receivingOptions}>
        <div onClick={startCall} className={cl.receivingOption}>
          <img src={phone} alt="answer call" />
        </div>
        <div onClick={stopCall} className={[cl.receivingOption, cl.red].join(' ')}>
          <img src={phone} alt="end call" />
        </div>
      </div>
    </div>
  )
}

export default Receiving