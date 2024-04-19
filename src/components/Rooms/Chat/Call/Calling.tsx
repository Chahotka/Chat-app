import React from 'react'
import callBg  from '../../../../images/Fish.mp4'
import cl from '../../../../styles/call-room.module.css'

const Calling: React.FC = () => {
  return (
    <div className={cl.calling}>
      <video autoPlay playsInline loop className={cl.receivingBg} src={callBg} />
      <p className={cl.callingText}>Connecting</p>
      <div className={cl.dot}>
        <span></span>
      </div>
    </div>
  )
}

export default Calling