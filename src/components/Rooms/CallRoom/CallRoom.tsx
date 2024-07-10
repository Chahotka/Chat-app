import React, { useState } from 'react'
import cl from '../../../styles/call-room.module.css'
import { useAppSelector } from '../../../app/hooks'
import InCall from './InCall'

const CallRoom: React.FC = () => {
  const { callState } = useAppSelector(state => state.call)

  const [hidden, setHidden] = useState(false)

  return (
    <div
      className={ hidden
        ? [cl.callRoom, cl.hidden].join(' ')
        : cl.callRoom
      }
    >
      <div
        className={ hidden
          ? [cl.hideButton, cl.hidden].join(' ')
          : cl.hideButton
        }
        onClick={() => setHidden(prev => !prev)}
      />

      { callState === 'inCall' && <InCall />}

      { callState === 'calling' }
      
      { callState === 'receiving' }

      { callState === 'disconnecting' }
    </div>
  )
}

export default CallRoom