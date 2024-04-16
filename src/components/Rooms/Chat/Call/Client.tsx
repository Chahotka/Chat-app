import { useEffect, useState } from 'react'
import cl from '../../../../styles/client.module.css'
import mic from '../../../../images/microphone.svg'
import headphones from '../../../../images/headphones.svg'
import screen from '../../../../images/screen.svg'
import { MediaElements } from '../../../../interfaces/MediaElements'
import { ProvideRef } from '../../../hooks/useWebRTC'

interface Props {
  deafened: boolean
  setDeafened: React.Dispatch<React.SetStateAction<boolean>>
  localStream: React.MutableRefObject<MediaStream | undefined>
  mediaElements: React.MutableRefObject<MediaElements>
  isSharing: boolean
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  clientId: string
  provideRef: ProvideRef
  shareScreen: (share: boolean) => void
}

const Client: React.FC<Props> = ({ 
  deafened, 
  setDeafened, 
  isSharing, 
  setIsSharing,
  localStream, 
  mediaElements, 
  clientId,
  provideRef,
  shareScreen 
}) => {
  const [muted, setMuted] = useState(false)

  const optionsHandler = (type: 'mute' | 'deafen') => {
    console.log('VOLUMING IN: ', clientId)
    if (type === 'mute') {
      if (deafened && clientId === 'LOCAL_VIDEO') {
        setMuted(false)
        setDeafened(false)
      } else {
        setMuted(!muted)
      }
    } else if (type === 'deafen') {
      if (!deafened) {
        setMuted(true)
        setDeafened(true)
      } else {
        setMuted(false)
        setDeafened(false)
      }
    } else if (type === 'share') {
      setIsSharing(prev => !prev)
    }
  }

  useEffect(() => {
    if (clientId === 'LOCAL_VIDEO' && localStream.current) {
      localStream.current.getAudioTracks()[0].enabled = !muted
    } else if (clientId !== 'LOCAL_VIDEO') {
      mediaElements.current[clientId].volume = muted ? 0 : 1
    }
  }, [muted])


  return (
    <li key={clientId} className={cl.clientBox}>
      <video
        title={clientId === 'LOCAL_VIDEO' ? 'local' : 'remote'}
        ref={instance => {
          provideRef(clientId, instance)
        }}
        autoPlay
        playsInline
        muted={clientId === 'LOCAL_VIDEO' ? true : deafened}
        className={cl.clientMedia}
      />
      <ul className={cl.streamOptions}>
        <li
          onClick={() => optionsHandler('mute')}
          className={muted
            ? [cl.streamOption, cl.muted].join(' ')
            : cl.streamOption
          }
        >
          <img className={cl.optionImg} src={mic} alt="mute mic" />
          <p className={cl.optionText}>{muted ? 'Unmute' : 'Mute'}</p>
        </li>
        {
          clientId === 'LOCAL_VIDEO' &&
          <li
            onClick={() => optionsHandler('deafen')}
            className={deafened
              ? [cl.streamOption, cl.muted].join(' ')
              : cl.streamOption
            }
          >
            <img className={cl.optionImg} src={headphones} alt="deaf mode" />
            <p className={cl.optionText}>{deafened ? 'Undeafen' : 'Deafen'}</p>
          </li>
        }
        {
          clientId === 'LOCAL_VIDEO' &&
          <li
            onClick={() => {
              setIsSharing(prev => {
                shareScreen(!prev)
                return !prev
              })
            }}
            className={isSharing
              ? [cl.streamOption, cl.muted].join(' ')
              : cl.streamOption
            }
          >
            <img className={cl.optionImg} src={screen} alt='share screen'/>
            <p className={cl.optionText}>{isSharing ? 'Stop share' : 'Share screen'}</p>
          </li>
        }
      </ul>
    </li>
  )
}

export default Client