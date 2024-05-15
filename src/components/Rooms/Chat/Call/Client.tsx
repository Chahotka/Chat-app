import React, { useState } from 'react'
import cl from '../../../../styles/call-room.module.css'
import { ProvideRef } from '../../../hooks/useWebRTC'
import ClientOptions from './ClientOptions'
import { MediaElements } from '../../../../interfaces/MediaElements'

interface Props {
  clientId: string
  deafen: boolean
  setDeafen: React.Dispatch<React.SetStateAction<boolean>>
  isSharing: boolean
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  mediaElements: React.MutableRefObject<MediaElements>
  localStream: React.MutableRefObject<MediaStream | undefined>
  shareScreen: (share: boolean) => void
  provideMedia: ProvideRef
}

const Client: React.FC<Props> = (
  {
    clientId,
    deafen,
    setDeafen,
    isSharing,
    setIsSharing,
    localStream,
    mediaElements,
    shareScreen,
    provideMedia,
  }
) => {
  const [muted, setMuted] = useState(false)

  return (
    <li className={cl.client}>
      <video
        ref={instance => {
          provideMedia(clientId, instance)
        }}
        autoPlay
        playsInline
        className={cl.clientVideo}
        title={clientId}
      />
      <ClientOptions
        clientId={clientId}
        muted={muted}
        setMuted={setMuted}
        deafen={deafen}
        setDeafen={setDeafen}
        isSharing={isSharing}
        setIsSharing={setIsSharing}
        localStream={localStream}
        mediaElements={mediaElements}
        shareScreen={shareScreen}
      />
    </li>
  )
}

export default Client