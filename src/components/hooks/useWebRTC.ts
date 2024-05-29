import { useEffect, useRef, useState } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import { ACTIONS } from "../../modules/Actions"
import { socket } from "../../socket/socket"
import freeice from 'freeice'
import { useAppSelector } from "../../app/hooks"
import { v4 } from "uuid"
import { usePeerConnections } from "./usePeerConnections"
import { useChannel } from "./useChannel"

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

export type Channel = {channelId: string, name: string, users: {name: string, id: string, avatar: string | null, creator?: true}[]}

export type CallState = 'calling' | 'receiving' | 'disconnecting' | 'inCall' | 'idle'
export type CallPermission = { callerName: string, callerId: string }
export type ProvideRef = (id: string, node: HTMLVideoElement | null) => void


export const useWebRTC = (roomId: string | undefined, type: string | undefined) => {
  const user = useAppSelector(state => state.user)


  const [caller, setCaller] = useState<CallPermission>({callerId: '', callerName: ''})
  const [callState, setCallState] = useState<CallState>('idle')
  const [isSharing, setIsSharing] = useState(false)




  const {
    clients, 
    localCameraStream,
    localScreenStream,
    peerMediaSenders,
    peerMediaElements
  } = usePeerConnections(setCaller, setCallState)

  const {
    joinedId, 
    groupChannels,
    joinChannel,
    leaveChannel,
    createChannel
  } = useChannel()


  const askPermission = () => {
    console.log('ASKING PERMISSON FOR A CALL')
    setCallState('calling')
    socket.emit(ACTIONS.ASK_PERMISSION, { caller: user.name, roomId})
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

    socket.emit(ACTIONS.STOP_CALL, roomId)
    setCallState('disconnecting')
    setTimeout(() => setCallState('idle'), 1500)
  }

  const hideCam = (hide: boolean, socketId: string | undefined) => {
    socket.emit(ACTIONS.HIDE_CAM, {
      hide,
      clientId: socketId,
      roomId
    })
  }



  const provideMediaRef: ProvideRef = (id, node) => {
    if (node) {
      peerMediaElements.current[id] = node
    }
  }

  // FOR SOCKET EVENTS
  

  return {
    clients,
    caller,
    callState,
    setCallState,
    isSharing,
    setIsSharing,
    joinedId,
    groupChannels,
    createChannel,
    joinChannel,
    leaveChannel,
    localCameraStream,
    peerMediaElements,
    startCall,
    stopCall,
    hideCam,
    shareScreen,
    askPermission,
    provideMediaRef,
  }
}