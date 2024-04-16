import { MutableRefObject, useEffect, useRef, useState } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import { ACTIONS } from "../../modules/Actions"
import { MediaElements } from "../../interfaces/MediaElements"
import { socket } from "../../socket/socket"
import freeice from 'freeice'
import { useAppSelector } from "../../app/hooks"
import e from "cors"

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

export type CallState = 'calling' | 'receiving' | 'disconnecting' | 'inCall' | 'idle'
export type CallPermission = { callerName: string, callerId: string }
export type ProvideRef = (id: string, node: HTMLVideoElement | null) => void

type AddPeer = { peerId: string, createOffer: boolean }
type iceCandidate = { peerId: string, iceCandidate: RTCIceCandidate }
type sessionDescription = { peerId: string, sessionDescription: RTCSessionDescription }

export const useWebRTC = (roomId: string) => {
  const user = useAppSelector(state => state.user)

  const { state: clients, updateState: updateClients } = useStateWithCallback([])

  const [caller, setCaller] = useState<CallPermission>()
  const [callState, setCallState] = useState<CallState>('idle')
  const [isSharing, setIsSharing] = useState(false)

  const localCameraStream = useRef<MediaStream>()
  const localScreenStream = useRef<MediaStream>()

  const peerMediaSenders = useRef<RTCRtpSender[]>([])
  const peerConnections = useRef<{[key: string]: RTCPeerConnection}>({})
  const peerMediaElements = useRef<{[key: string]: HTMLVideoElement}>({})

  const addNewClient = (newClient: string, cb: Function) => {
    if (!clients.includes(newClient)) {
      updateClients((list: []) => [...list, newClient], cb)
    }
  }

  const askPermission = () => {
    console.log('ASKING PERMISSON FOR A CALL')
    setCallState('calling')
    socket.emit(ACTIONS.ASK_PERMISSION, { caller: user.name, roomId})
  }

  const startCapture = async () => {
    console.log('CAPTURING CAMERA')
    localCameraStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })

    addNewClient(LOCAL_VIDEO, () => {
      const localVideoElement = peerMediaElements.current[LOCAL_VIDEO]

      if (localVideoElement && localCameraStream.current) {
        localVideoElement.volume = 0
        localVideoElement.srcObject = localCameraStream.current
      }
    })
  }
  const startScreenCapture = async () => {
    console.log('CAPTURING SCREEN')
    localScreenStream.current = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true
    })

    setIsSharing(true)
  }

  const shareScreen = async (share: boolean) => {
    const cameraStream = localCameraStream.current?.getTracks().find(track => track.kind === 'video')

    if (share && cameraStream) {
      await startScreenCapture()
      const screenStream = localScreenStream.current?.getTracks().find(track => track.kind === 'video')

      if (screenStream) {
        screenStream.onended = () => {
          localScreenStream.current?.getTracks().forEach(track => track.stop())

          const localVideo = peerMediaElements.current[LOCAL_VIDEO]
  
          if (localVideo && localCameraStream.current) {
            localVideo.volume = 0
            localVideo.srcObject = localCameraStream.current
          }
          
          peerMediaSenders.current.find(sender => sender.track?.kind === 'video')
            ?.replaceTrack(cameraStream)

          setIsSharing(false)
        }

        peerMediaSenders.current.find(sender => sender.track?.kind === 'video')
          ?.replaceTrack(screenStream)
  
        const localVideo = peerMediaElements.current[LOCAL_VIDEO]
  
        if (localVideo && localScreenStream.current) {
          localVideo.volume = 0
          localVideo.srcObject = localScreenStream.current
        }
      }
    } else if (!share && cameraStream) {
      localScreenStream.current?.getTracks().forEach(track => track.stop())

      peerMediaSenders.current.find(sender => sender.track?.kind === 'video')
        ?.replaceTrack(cameraStream)

      const localVideo = peerMediaElements.current[LOCAL_VIDEO]
  
      if (localVideo && localCameraStream.current) {
        localVideo.volume = 0
        localVideo.srcObject = localCameraStream.current
      }
    }
  }    

  const startCall = async () => {
    console.log('STARTING CALL')
    setCallState('calling')
    socket.emit(ACTIONS.CALL, { roomId })
  }

  const stopCall = () => {
    localCameraStream.current?.getTracks().forEach(track => {
      track.stop()
    })

    socket.emit(ACTIONS.STOP_CALL)
  }

  const provideMediaRef: ProvideRef = (id, node) => {
    console.log('PROVIDING REF FOR: ', id, ' ', node)
    if (node) {
      peerMediaElements.current[id] = node
    }
  }

  // FOR SOCKET EVENTS
  useEffect(() => {
    const onPermission = ({callerName, callerId}: CallPermission) => {
      console.log('RECEIVING ASK FOR PERMISSION')
      setCaller({callerName, callerId})
      setCallState('receiving')
    }
    const onAddPeer = async ({ peerId, createOffer }: AddPeer) => {
      if (peerId in peerConnections.current) {
        return console.warn('ALREADY ADDED THIS PEER')
      }
      console.log('ADDING PEER: ', peerId)

      await startCapture()

      peerConnections.current[peerId] = new RTCPeerConnection({iceServers: freeice()})

      localCameraStream.current?.getTracks().forEach(track => {
        if (localCameraStream.current) {
          peerMediaSenders.current.push(peerConnections.current[peerId].addTrack(track, localCameraStream.current))
        }
      })

      peerConnections.current[peerId].ontrack = ({ track, streams: [remoteStream] }) => {
        console.log('RECEIVING REMOTE STREAM ')
        if (track.kind === 'video') {
          addNewClient(peerId, () => {
            peerMediaElements.current[peerId].srcObject = remoteStream
          })
        }
      }
      peerConnections.current[peerId].onicecandidate = ({ candidate }) => {
        if (candidate) {
          console.log('SENDING NEW ICE CANDIDATE')
          socket.emit(ACTIONS.RELAY_ICE, { peerId, iceCandidate: candidate})
        }
      }
      peerConnections.current[peerId].onconnectionstatechange = () => {
        console.log('CONNECTION STATE: ', peerConnections.current[peerId].connectionState)

        if (peerConnections.current[peerId].connectionState === 'connected') {
          setCallState('inCall')
        }
      }


      if (createOffer) {
        const offer = await peerConnections.current[peerId].createOffer()

        await peerConnections.current[peerId].setLocalDescription(new RTCSessionDescription(offer))
        socket.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer
        })
      }
    }
    const onRemovePeer = ({ peerId }: {peerId: string}) => {
      updateClients((list: []) => list.filter(id => id !== peerId), () => {
        if (peerConnections.current[peerId]) {
          peerConnections.current[peerId].close()
        }

        localCameraStream.current?.getTracks().forEach(track => {
          track.stop()
        })

        delete peerConnections.current[peerId]
        delete peerMediaElements.current[peerId]
        delete peerMediaElements.current[LOCAL_VIDEO]

        setCallState('disconnecting')
        setTimeout(() => setCallState('idle'), 1500)
      })
    }
    const onIceCandidate = ({ peerId, iceCandidate }: iceCandidate) => {
      console.log('RECEIVING ICE CANDIDATE')
      peerConnections.current[peerId].addIceCandidate(new RTCIceCandidate(iceCandidate))
    }
    const onSessionDescription = async ({ peerId, sessionDescription }: sessionDescription) => {
      if (sessionDescription.type === 'offer') {
        console.log('RECEIVING OFFER')
        await peerConnections.current[peerId].setRemoteDescription(new RTCSessionDescription(sessionDescription))
      
        const answer = await peerConnections.current[peerId].createAnswer()
        
        await peerConnections.current[peerId].setLocalDescription(new RTCSessionDescription(answer))
        socket.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer
        })
      }
      if (sessionDescription.type === 'answer') {
        console.log('RECEIVING ANSWER')
        await peerConnections.current[peerId].setRemoteDescription(new RTCSessionDescription(sessionDescription))
      }
    }

    socket.on(ACTIONS.CALL_PERMISSION, onPermission)
    socket.on(ACTIONS.ADD_PEER, onAddPeer)
    socket.on(ACTIONS.REMOVE_PEER, onRemovePeer)
    socket.on(ACTIONS.ICE_CANDIDATE, onIceCandidate)
    socket.on(ACTIONS.SESSION_DESCRIPTION, onSessionDescription)


    return () => {
      socket.off(ACTIONS.CALL_PERMISSION, onPermission)
      socket.off(ACTIONS.ADD_PEER, onAddPeer)
      socket.off(ACTIONS.REMOVE_PEER, onRemovePeer)
      socket.off(ACTIONS.ICE_CANDIDATE, onIceCandidate)
      socket.off(ACTIONS.SESSION_DESCRIPTION, onSessionDescription)
    }
  }, [])

  

  return {
    clients,
    caller,
    callState,
    setCallState,
    isSharing,
    setIsSharing,
    localCameraStream,
    peerMediaElements,
    startCall,
    stopCall,
    shareScreen,
    askPermission,
    provideMediaRef,
  }
}