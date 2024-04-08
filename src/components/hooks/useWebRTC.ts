import { MutableRefObject, useEffect, useRef, useState } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import { ACTIONS } from "../../modules/Actions"
import { MediaElements } from "../../interfaces/MediaElements"
import { socket } from "../../socket/socket"
import freeice from 'freeice'
import { useAppSelector } from "../../app/hooks"

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

export type CallState = 'calling' | 'receiving' | 'disconnecting' | 'inCall' | 'idle'
export type CallPermission = { callerName: string, callerId: string }
type AddPeer = { peerId: string, createOffer: boolean }
type iceCandidate = { peerId: string, iceCandidate: RTCIceCandidate }
type sessionDescription = { peerId: string, sessionDescription: RTCSessionDescription }

export const useWebRTC = (roomId: string) => {
  const name = useAppSelector(state => state.user.name)
  const { state: clients, updateState: updateClients } = useStateWithCallback([])

  const [callState, setCallState] = useState<CallState>('idle')
  const [caller, setCaller] = useState<CallPermission | null>(null)
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({})
  const peerMediaElements = useRef<MediaElements>({})
  const localMediaStream = useRef<MediaStream | null>(null)

  const addNewClient = (newClient: string, cb: Function) => {
    console.log('adding new client')
    if (!clients.includes(newClient)) {
      updateClients((list: string[]) => [...list, newClient], cb)
    }
  }

  const startCapture = async () => {
    localMediaStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })

    addNewClient(LOCAL_VIDEO, () => {
      const localVideoElement = peerMediaElements.current[LOCAL_VIDEO]

      if (localVideoElement) {
        localVideoElement.volume = 0
        localVideoElement.srcObject = localMediaStream.current
      }
    })
  }

  const askForCall = () => {
    setCallState('calling')
    socket.emit(ACTIONS.ASK_PERMISSION, {caller: name, roomId })
  }

  const startCall = () => {
    setCallState('calling')
    socket.emit(ACTIONS.CALL, { roomId })
  }

  const stopCall = () => {
    if (localMediaStream.current) {
      localMediaStream.current.getTracks().forEach(track => {
        track.stop()
      })
    }

    socket.emit(ACTIONS.STOP_CALL)
  }


  const provideMediaRef = (id: string, node: HTMLVideoElement | null) => {
    if (node) {
      peerMediaElements.current[id] = node
    }
  }

  useEffect(() => {
    const onCallPermission = ({ callerName, callerId }: CallPermission) => {
      setCallState('receiving')
      setCaller({callerName, callerId})
    }
    const onAddPeer = async ({ peerId, createOffer }: AddPeer) => {
      if (peerId in peerConnections) {
        return console.warn('Already added this peer')
      }

      peerConnections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice()
      })

      await startCapture()
        .then(() => {
          if (localMediaStream.current) {
            localMediaStream.current.getTracks().forEach(track => {
              peerConnections.current[peerId].addTrack(track, localMediaStream.current!)
            })
          }
        })

      const dc = peerConnections.current[peerId].createDataChannel('channel')

      let trackNumber = 0
      peerConnections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        trackNumber++

        if (trackNumber === 2) {
          addNewClient(peerId, () => {
            peerMediaElements.current[peerId].srcObject = remoteStream
          })
        }
      }
      peerConnections.current[peerId].onicecandidate = e => {
        if (e.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, { peerId, iceCandidate: e.candidate })
        }
      }
      peerConnections.current[peerId].onconnectionstatechange = e => {
        console.log('CONNECTION STATE: ', peerConnections.current[peerId].connectionState)
        if (peerConnections.current[peerId].connectionState === 'connected') {
          setCallState('inCall')
        }
      }

      if (createOffer) {
        const offer = await peerConnections.current[peerId].createOffer()

        await peerConnections.current[peerId].setLocalDescription(new RTCSessionDescription(offer))
        socket.emit(ACTIONS.RELAY_SDP, { peerId, sessionDescription: offer })
      }
    }
    const onIceCandidate = async ({ peerId, iceCandidate }: iceCandidate) => {
      try {
        await peerConnections.current[peerId].addIceCandidate(new RTCIceCandidate(iceCandidate))
        console.log('Exchanging Ice Candidates')
      } catch (e) {
        console.error('Error adding ice candidate: ', e)
      }
    }
    const onSessionDescription = async ({ peerId, sessionDescription }: sessionDescription) => {
      console.log('Exchanging SDP')
      if (sessionDescription.type === 'offer') {
        await peerConnections.current[peerId].setRemoteDescription(new RTCSessionDescription(sessionDescription))

        const answer = await peerConnections.current[peerId].createAnswer()

        await peerConnections.current[peerId].setLocalDescription(new RTCSessionDescription(answer))
        socket.emit(ACTIONS.RELAY_SDP, { peerId, sessionDescription: answer })
      }
      if (sessionDescription.type === 'answer') {
        await peerConnections.current[peerId].setRemoteDescription(new RTCSessionDescription(sessionDescription))
      }
    }
    const onRemovePeer = ({ peerId }: { peerId: string }) => {
      console.log('Removing peer: ', peerId)
      updateClients([], () => {
        if (peerConnections.current[peerId]) {
          peerConnections.current[peerId].close()
        }

        if (localMediaStream.current) {
          localMediaStream.current.getTracks().forEach(track => {
            track.stop()
          })
        }

        delete peerConnections.current[peerId]
        delete peerMediaElements.current[peerId]
        delete peerMediaElements.current[LOCAL_VIDEO]

        setCallState('disconnecting')
        setTimeout(() => setCallState('idle'), 1000)
      }
      )
    }


    socket.on(ACTIONS.CALL_PERMISSION, onCallPermission)
    socket.on(ACTIONS.ADD_PEER, onAddPeer)
    socket.on(ACTIONS.REMOVE_PEER, onRemovePeer)
    socket.on(ACTIONS.ICE_CANDIDATE, onIceCandidate)
    socket.on(ACTIONS.SESSION_DESCRIPTION, onSessionDescription)

    return () => {
      socket.off(ACTIONS.CALL_PERMISSION, onCallPermission)
      socket.off(ACTIONS.ADD_PEER, onAddPeer)
      socket.off(ACTIONS.REMOVE_PEER, onRemovePeer)
      socket.off(ACTIONS.ICE_CANDIDATE, onIceCandidate)
      socket.off(ACTIONS.SESSION_DESCRIPTION, onSessionDescription)
    }
  }, [])

  return {
    localMediaStream,
    peerMediaElements,
    clients,
    askForCall,
    startCall,
    stopCall,
    caller,
    callState,
    setCallState,
    provideMediaRef
  }
}