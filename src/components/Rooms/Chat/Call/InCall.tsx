import React from 'react'
import cl from '../../../../styles/call-room.module.css'
import Clients from './Clients'
import phone from '../../../../images/phone.svg'
import { ProvideRef } from '../../../hooks/useWebRTC'
import { MediaElements } from '../../../../interfaces/MediaElements'

interface Props {
  clients: string[]
  isSharing: boolean
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  mediaElements: React.MutableRefObject<MediaElements>
  localStream: React.MutableRefObject<MediaStream | undefined>
  stopCall: () => void
  hideCam: (hide: boolean, socketId: string | undefined) => void
  shareScreen: (share: boolean) => void
  provideMedia: ProvideRef
}

const InCall: React.FC<Props> = (
  {
    clients,
    isSharing,
    setIsSharing,
    localStream,
    mediaElements,
    stopCall,
    hideCam,
    shareScreen,
    provideMedia
  }
) => {
  return (
    <div className={cl.inCall}>
      <Clients
        clients={clients}
        provideMedia={provideMedia}
        isSharing={isSharing}
        setIsSharing={setIsSharing}
        localStream={localStream}
        mediaElements={mediaElements}
        hideCam={hideCam}
        shareScreen={shareScreen}
      />
      <div className={cl.receivingOptions}>
        <div onClick={stopCall} className={[cl.receivingOption, cl.red].join(' ')}>
          <img src={phone} alt='end call' />
        </div>
      </div>
    </div>
  )
}

export default InCall