import React, { useEffect } from 'react'
import cl from '../../../../styles/call-room.module.css'
import cam from '../../../../images/cam.svg'
import mute from '../../../../images/microphone.svg'
import deaf from '../../../../images/headphones.svg'
import screen from '../../../../images/screen.svg'
import { MediaElements } from '../../../../interfaces/MediaElements'
import { socket } from '../../../../socket/socket'
import { useAppSelector } from '../../../../app/hooks'

interface Props {
  clientId: string
  muted: boolean
  setMuted: React.Dispatch<React.SetStateAction<boolean>>
  shareCam: boolean
  setShareCam: React.Dispatch<React.SetStateAction<boolean>>
  hideCam: (hide: boolean, socketId: string | undefined) => void
  deafen: boolean
  setDeafen: React.Dispatch<React.SetStateAction<boolean>>
  isSharing: boolean
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  mediaElements: React.MutableRefObject<MediaElements>
  localStream: React.MutableRefObject<MediaStream | undefined>
  shareScreen: (share: boolean) => void
}

const ClientOptions: React.FC<Props> = (
  {
    clientId,
    muted,
    setMuted,
    shareCam,
    setShareCam,
    hideCam,
    deafen,
    setDeafen,
    isSharing,
    setIsSharing,
    localStream,
    mediaElements,
    shareScreen,
  }
) => {
  const roomId = useAppSelector(state => state.user.activeRoom?.roomId)

  const optionsHandler = (type: 'mute' | 'deaf' | 'screen' | 'cam') => {
    if (type === 'mute') {
      if (deafen && muted) {
        setMuted(false)
        setDeafen(false)
      } else {
        setMuted(prev => !prev)
      }
    }
    if (type === 'deaf') {
      if (!muted && !deafen) {
        setMuted(true)
        setDeafen(true)
      } else {
        setDeafen(prev => !prev)
      }
    }
    if (type === 'screen') {
      setIsSharing(prev => {
        shareScreen(!prev)
        return !prev
      })
    }
    if (type === 'cam') {
      setShareCam(prev => {
        localStream.current?.getVideoTracks().forEach(track => {
          track.enabled = !prev
        })

        hideCam(!prev, socket.id)
        return !prev
      })
    }
  }

  useEffect(() => {
    if (clientId === 'LOCAL_VIDEO' && localStream.current) {
      localStream.current.getAudioTracks()[0].enabled = !muted
    } else {
      mediaElements.current[clientId].volume = muted ? 0 : 1
    }
  }, [muted])

  return (
    <ul className={cl.clientOptions}>
      <li
        className={muted ? [cl.clientOption, cl.active].join(' ') : cl.clientOption}
        onClick={() => optionsHandler('mute')}
      >
        <img src={mute} />
        <p className={cl.clientOptionText}>{muted ? 'Unmute' : 'Mute'}</p>
      </li>
      { clientId === 'LOCAL_VIDEO' &&
        <>
          <li
            className={deafen ? [cl.clientOption, cl.active].join(' ') : cl.clientOption}
            onClick={() => optionsHandler('deaf')}
          >
            <img src={deaf} />
            <p className={cl.clientOptionText}>{deafen ? 'Undeafen' : 'deafen'}</p>
          </li>
          <li
            className={shareCam ? [cl.clientOption, cl.active].join(' ') : cl.clientOption}
            onClick={() => optionsHandler('cam')}
          >
            <img src={cam} />
            <p className={cl.clientOptionText}>{deafen ? 'Stop Sharing' : 'Share Cam'}</p>
          </li>
          <li
            className={isSharing ? [cl.clientOption, cl.active].join(' ') : cl.clientOption}
            onClick={() => optionsHandler('screen')}
          >
            <img src={screen} />
            <p className={cl.clientOptionText}>{isSharing ? 'Stop Sharing' : 'Share Screen'}</p>
          </li>
        </>
      }
    </ul>
  )
}

export default ClientOptions