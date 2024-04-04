import { useEffect, useState } from 'react'
import cl from '../../../../styles/client.module.css'
import mic from '../../../../images/microphone.svg'
import headphones from '../../../../images/headphones.svg'
import { MediaElements } from '../../../../interfaces/MediaElements'

interface Props {
  deafened: boolean
  setDeafened: React.Dispatch<React.SetStateAction<boolean>>
  localStream: React.MutableRefObject<MediaStream | null>
  mediaElements: React.MutableRefObject<MediaElements>
  clientId: string
  provideRef: Function
}

const Client: React.FC<Props> = ({ deafened, setDeafened, localStream, mediaElements, clientId, provideRef }) => {
  const [muted, setMuted] = useState(false)
  // если себя то enable если другого то .volume 

  const volumeHandler = (type: 'mute' | 'deafen') => {
    console.log('VOLUMING IN: ', clientId)
    if (type === 'mute') {
      if (deafened && clientId === 'LOCAL_VIDEO') {
        setMuted(false)
        setDeafened(false)
      } else {
        setMuted(!muted)
      }
    } else {
      if (!deafened) {
        setMuted(true)
        setDeafened(true)
      } else {
        setMuted(false)
        setDeafened(false)
      }
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
          onClick={() => volumeHandler('mute')}
          className={muted
            ? [cl.streamOption, cl.muted].join(' ')
            : cl.streamOption
          }
        >
          <img className={cl.optionImg} src={mic} alt="mute mic" />
          <p className={cl.optionText}>{muted ? 'Unmute' : 'Mute'}</p>
        </li>
        {clientId === 'LOCAL_VIDEO' &&
          <li
            onClick={() => volumeHandler('deafen')}
            className={deafened
              ? [cl.streamOption, cl.muted].join(' ')
              : cl.streamOption
            }
          >
            <img className={cl.optionImg} src={headphones} alt="deaf mode" />
            <p className={cl.optionText}>{deafened ? 'Undeafen' : 'Deafen'}</p>
          </li>
        }
      </ul>
    </li>
  )
}

export default Client