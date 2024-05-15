import React, { useState } from 'react'
import cl from '../../../../styles/call-room.module.css'
import { CallPermission, CallState, ProvideRef } from '../../../hooks/useWebRTC'
import { MediaElements } from '../../../../interfaces/MediaElements'
import Receiving from './Receiving'
import Calling from './Calling'
import InCall from './InCall'
import Disconnecting from './Disconnecting'

interface Props {
  clients: string[]
  caller: CallPermission | undefined
  callState: CallState
  isSharing: boolean
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  mediaElements: React.MutableRefObject<MediaElements>
  localStream: React.MutableRefObject<MediaStream | undefined>
  startCall: () => void
  stopCall: () => void
  hideCam: (hide: boolean, socketId: string | undefined) => void
  provideMediaRef: ProvideRef
  shareScreen: (share: boolean) => void
}

const CallRoom: React.FC<Props> = (
  {
    clients,
    caller,
    callState,
    isSharing,
    setIsSharing,
    localStream,
    mediaElements,
    startCall,
    stopCall,
    hideCam,
    shareScreen,
    provideMediaRef,
  }
) => {
  const [hidden, setHidden] = useState(false)

  return (
    <div className={hidden ? [cl.callRoom, cl.hidden].join(' ') : cl.callRoom}>
      {callState === 'calling' &&
        <Calling />
      }
      {callState === 'receiving' &&
        <Receiving caller={caller} stopCall={stopCall} startCall={startCall} />
      }
      {callState === 'inCall' &&
        <InCall
          clients={clients}
          isSharing={isSharing}
          setIsSharing={setIsSharing}
          localStream={localStream}
          mediaElements={mediaElements}
          stopCall={stopCall}
          hideCam={hideCam}
          shareScreen={shareScreen}
          provideMedia={provideMediaRef}
        />
      }
      {callState === 'disconnecting' && <Disconnecting />}
      <div
        onClick={() => setHidden(prev => !prev)}
        className={hidden
          ? [cl.roller, cl.hidden].join(' ')
          : cl.roller
        }
      />
    </div>
  )
}

export default CallRoom