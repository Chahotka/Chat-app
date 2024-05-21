import { useEffect, useRef, useState } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import { ACTIONS } from "../../modules/Actions"
import { socket } from "../../socket/socket"
import freeice from 'freeice'
import { useAppSelector } from "../../app/hooks"
import { v4 } from "uuid"

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

export type Channel = {channelId: string, name: string, users: {name: string, id: string, avatar: string | null, creator?: true}[]}

export type CallState = 'calling' | 'receiving' | 'disconnecting' | 'inCall' | 'idle'
export type CallPermission = { callerName: string, callerId: string }
export type ProvideRef = (id: string, node: HTMLVideoElement | null) => void

type AddPeer = { peerId: string, createOffer: boolean }
type iceCandidate = { peerId: string, iceCandidate: RTCIceCandidate }
type sessionDescription = { peerId: string, sessionDescription: RTCSessionDescription }

export const useWebRTC = (roomId: string | undefined, type: string | undefined) => {
  const user = useAppSelector(state => state.user)

  const { state: clients, updateState: updateClients } = useStateWithCallback([])

  const [caller, setCaller] = useState<CallPermission>()
  const [callState, setCallState] = useState<CallState>('idle')
  const [isSharing, setIsSharing] = useState(false)

  const [joinedId, setJoinedId] = useState<undefined | string>()
  const [groupChannels, setGroupChannels] = useState<Channel[]>([
    {
      name: 'Gubka Bob',
      channelId: '123-12311-231-23-123',
      users: [
        {
          id: '12-312-3=15==1gg',
          name: 'Gubka bob',
          avatar: null
        },
        {
          id: '12-312-3=15=sddsf=1gg',
          name: 'Aboba',
          avatar: null
        }
      ]
    },
    {
      name: 'Chechnya',
      channelId: '123-12311-231-23-1231231',
      users: [
        {
          id: '12-312-3=15==1ggsd',
          name: 'kavo',
          avatar: null
        }
      ]
    },
    {
      name: 'Elkjadkl;jf',
      channelId: '123-12311-231-bzxcvxcv-1231231',
      users: [
        {
          id: '12-312-3=15==1uy452ggsd',
          name: 'Kcvnao',
          avatar: null
        }
      ]
    }
  ])

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

  const leaveChannel = (joining: boolean) => {
    if (!joinedId) {
      return groupChannels
    }

    const joined = groupChannels.filter(channel => channel.channelId === joinedId)[0]

    if (joined.users.length >= 2) {
      joined.users = joined.users.filter(channelUser => channelUser.id !== user.id)

      const filteredChannels = groupChannels.filter(channel => channel.channelId !== joinedId)

      if (joining) {
        return [...filteredChannels, joined]
      } else {
        return setGroupChannels([...filteredChannels, joined])
      }
    }

    if (joining) {
      return groupChannels.filter(channel => channel.channelId !== joinedId)
    } else {
      return setGroupChannels(groupChannels.filter(channel => channel.channelId !== joinedId))
    }
    
  }

  const joinChannel = (id: string) => {
    if (joinedId === id) {
      return console.warn('You already joined this channel')
    }

    const channels = leaveChannel(true)

    if (!channels) {
      return
    }

    const channel = channels.filter(channel => channel.channelId === id)[0]
    
    channel.users.push({
      id: user.id,
      name: user.name,
      avatar: user.avatar
    })
    
    const filteredChannels = channels.filter(channel => channel.channelId !== id)

    setJoinedId(id)
    setGroupChannels([...filteredChannels, channel])
  }
  const createChannel = () => {
    const channelId = v4()

    const channels = leaveChannel(true)

    if (!channels) {
      return
    }

    const joined = channels.filter(channel => channel.channelId === joinedId)[0]
    
    if (joined) {
      const channelUser = joined.users.filter(channelUser => channelUser.id === user.id)[0]

      if (channelUser && channelUser.creator) {
        return console.warn('You already created room')
      } else {
        const filteredChannels = channels.filter(channel => channel.channelId !== joined.channelId)

        setGroupChannels([
          ...filteredChannels,
          joined,
          {
            name: `${user.name}'s Channel`,
            channelId,
            users: [{
              id: user.id,
              name: user.name,
              avatar: user.avatar,
              creator: true
            }]
          }
        ])
        setJoinedId(channelId)
      }
    } else {
      setGroupChannels(prev => [
        ...prev,
        {
          name: `${user.name}'s Channel`,
          channelId,
          users: [{
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            creator: true
          }]
        }
      ])
      setJoinedId(channelId)
    }
  }


  const provideMediaRef: ProvideRef = (id, node) => {
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
    caller,
    callState,
    setCallState,
    isSharing,
    setIsSharing,
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