import React from 'react'
import cl from '../../../../styles/call-room.module.css'

interface Props {

}

const Disconnecting: React.FC<Props> = () => {
  return (
    <div className={cl.disconnecting}>
      <p className={cl.disconnectingText}>Disconnecting</p>
    </div>
  )
}

export default Disconnecting