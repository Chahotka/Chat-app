import React, { useEffect, useState } from 'react'
import cl from '../../../../styles/call-room.module.css'
import defImg from '../../Mogged.png'
import { ProvideRef } from '../../../hooks/useWebRTC'
import ClientOptions from './ClientOptions'
import { MediaElements } from '../../../../interfaces/MediaElements'
import { ACTIONS } from '../../../../modules/Actions'
import { socket } from '../../../../socket/socket'

interface Props {
  clientId: string
  deafen: boolean
  setDeafen: React.Dispatch<React.SetStateAction<boolean>>
  isSharing: boolean
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  mediaElements: React.MutableRefObject<MediaElements>
  localStream: React.MutableRefObject<MediaStream | undefined>
  shareScreen: (share: boolean) => void
  hideCam: (hide: boolean, socketId: string | undefined) => void
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
    hideCam,
    provideMedia,
  }
) => {
  const [muted, setMuted] = useState(false)
  const [shareCam, setShareCam] = useState(false)

  useEffect(() => {
    const handleCam = (
      {hide, userId}:
      {hide: boolean, userId: string}
    ) => {
      if (userId === clientId) {
        setShareCam(hide)
      }
    }
  
    socket.on(ACTIONS.HANDLE_CAM, handleCam)

    return () => {
      socket.off(ACTIONS.HANDLE_CAM, handleCam)
    }
  }, [shareCam])

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
      <div className={shareCam ? cl.hideClient : [cl.hideClient, cl.hide].join(' ')}>
        <img src={defImg} alt='user avatar' />
      </div>

      <ClientOptions
        clientId={clientId}
        muted={muted}
        setMuted={setMuted}
        shareCam={shareCam}
        setShareCam={setShareCam}
        hideCam={hideCam}
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