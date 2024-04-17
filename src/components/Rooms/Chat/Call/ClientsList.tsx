import React, { useState } from 'react'
import cl from '../../../../styles/call-room.module.css'
import { ProvideRef } from '../../../hooks/useWebRTC'
import { MediaElements } from '../../../../interfaces/MediaElements'
import Client from './Client'

interface Props {
  clients: string[]
  isSharing: boolean
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  mediaElements: React.MutableRefObject<MediaElements>
  localStream: React.MutableRefObject<MediaStream | undefined>
  provideMediaRef: ProvideRef
  shareScreen: (share: boolean) => void
}
const ClientsList: React.FC<Props> = (
  { 
    clients,
    isSharing,
    setIsSharing,
    localStream,
    mediaElements,
    shareScreen,
    provideMediaRef,
  }
) => {
  const [deafened, setDeafened] = useState(false)
  
  return (
    <ul className={cl.clients}>
      {clients.map(clientId => {
        return (
          <Client 
            key={clientId}
            clientId={clientId}
            deafened={deafened}
            setDeafened={setDeafened}
            isSharing={isSharing}
            setIsSharing={setIsSharing}
            localStream={localStream}
            mediaElements={mediaElements}
            shareScreen={shareScreen}
            provideRef={provideMediaRef}
          />
        )
      })}
    </ul>
  )
}

export default ClientsList