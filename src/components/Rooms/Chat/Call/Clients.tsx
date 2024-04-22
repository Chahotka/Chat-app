import React, { useState } from 'react'
import cl from '../../../../styles/call-room.module.css'
import { ProvideRef } from '../../../hooks/useWebRTC'
import Client from './Client'
import { MediaElements } from '../../../../interfaces/MediaElements'

interface Props {
  clients: string[]
  isSharing: boolean
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  mediaElements: React.MutableRefObject<MediaElements>
  localStream: React.MutableRefObject<MediaStream | undefined>
  shareScreen: (share: boolean) => void
  provideMedia: ProvideRef
}

const Clients: React.FC<Props> = (
  { 
    clients, 
    isSharing, 
    setIsSharing, 
    localStream,
    mediaElements,
    shareScreen,
    provideMedia

  }) => {
  const [deafen, setDeafen] = useState(false)

  return (
    <ul className={cl.clients}>
      {clients.map(clientId => 
        <Client 
          key={clientId} 
          clientId={clientId}
          deafen={deafen}
          setDeafen={setDeafen}
          isSharing={isSharing}
          setIsSharing={setIsSharing}
          localStream={localStream}
          mediaElements={mediaElements}
          shareScreen={shareScreen}
          provideMedia={provideMedia}
        />
      )}
    </ul>
  )
}

export default Clients