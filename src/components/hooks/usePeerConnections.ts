import { useEffect, useRef } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import { CallPermission, CallState, LOCAL_VIDEO } from "./useWebRTC"
import { socket } from "../../socket/socket"
import freeice from 'freeice'
import { ACTIONS } from "../../modules/Actions"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

type AddPeer = { peerId: string, createOffer: boolean }
type iceCandidate = { peerId: string, iceCandidate: RTCIceCandidate }
type sessionDescription = { peerId: string, sessionDescription: RTCSessionDescription }

export const usePeerConnections = (
  setCaller: React.Dispatch<React.SetStateAction<CallPermission>>,
  setCallState: React.Dispatch<React.SetStateAction<CallState>>
) => {
  const { state: clients, updateState: updateClients} = useStateWithCallback([])

  const peerConnections = useRef<{[key: string]: RTCPeerConnection}>({})

  const localCameraStream = useRef<MediaStream>()
  const localScreenStream = useRef<MediaStream>()

  const peerMediaSenders = useRef<RTCRtpSender[]>([])
  const peerMediaElements = useRef<{[key: string]: HTMLVideoElement}>({})

  const addNewClient = (newClient: string, cb: Function) => {
    if (!clients.includes(newClient)) {
      updateClients((list: []) => [...list, newClient], cb)
    }
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


  useEffect(() => {
    const onPermission = ({callerName, callerId}: CallPermission) => {
      console.log('RECEIVING ASK FOR PERMISSION')
      setCaller({callerName, callerId})
      setCallState('receiving')
    }
    const onAddPeer = async ({ peerId, createOffer }: AddPeer) => {
      if (peerId === socket.id) {
        return
      }
      if (peerId in peerConnections.current) {
        return console.warn('ALREADY ADDED THIS PEER')
      }

      await startCapture()
      setCallState('inCall')

      peerConnections.current[peerId] = new RTCPeerConnection({iceServers: freeice()})

      localCameraStream.current?.getTracks().forEach(track => {
        if (localCameraStream.current) {
          peerMediaSenders.current.push(peerConnections.current[peerId]
            .addTrack(track, localCameraStream.current))
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
        if (peerConnections.current[peerId].connectionState === 'failed') {
          console.log('ERROR ESTABLISHING CONNECTION')
        }
        console.log('CONNECTION STATE: ', peerConnections.current[peerId].connectionState)
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
      console.log('peer in ', peerId in peerConnections.current)
      if (peerId in peerConnections.current) {
        updateClients([], () => {
          if (peerConnections.current[peerId]) {
            peerConnections.current[peerId].close()
          }
  
          localCameraStream.current?.getTracks().forEach(track => {
            track.stop()
          })
  
          delete peerConnections.current[peerId]
          delete peerMediaElements.current[peerId]
          delete peerMediaElements.current[LOCAL_VIDEO]
  
          console.log('REMOVING PEER', peerId)
          setCallState('disconnecting')
          setTimeout(() => setCallState('idle'), 1500)
        })
      }
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

      socket.emit(ACTIONS.STOP_CALL)
      
      localCameraStream.current?.getTracks().forEach(track => track.stop())
      localScreenStream.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  return {
    clients,
    localCameraStream,
    localScreenStream,
    peerMediaSenders,
    peerMediaElements
  }
}