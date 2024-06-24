import { useEffect, useState } from "react"
import { Channel } from "./useWebRTC"
import { useAppSelector } from "../../app/hooks"
import { v4 } from "uuid"
import { socket } from "../../socket/socket"
import { ACTIONS } from "../../modules/Actions"

export const useChannel = (
  roomId: string | undefined
) => {
  const user = useAppSelector(state => state.user)
  
  const [joinedId, setJoinedId] = useState<undefined | string>()
  const [groupChannels, setGroupChannels] = useState<Channel[]>([])

  const joinChannel = (id: string) => {
    if (!socket.id) { 
      return
    }
    if (joinedId) {
      leaveChannel()
    }

    const channel = groupChannels.filter(c => c.channelId === id)[0]
    const filteredChannels = groupChannels.filter(c => c.channelId !== id)

    channel.users.push({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      socketId: socket.id
    })

    const channels = [...filteredChannels, channel].filter(c => c.users.length > 0)

    setJoinedId(id)
    setGroupChannels(channels)

    socket.emit(ACTIONS.JOIN_CHANNEL, roomId, channel)
  }

  const leaveChannel = () => {
    const channel = groupChannels.filter(c => c.channelId === joinedId)[0]
    const filteredChannels = groupChannels.filter(c => c.channelId !== joinedId)

    channel.users = channel.users.filter(u => u.id !== user.id)

    const channels = [...filteredChannels, channel].filter(c => c.users.length > 0)

    setJoinedId(undefined)
    setGroupChannels(channels)

    socket.emit(ACTIONS.LEAVE_CHANNEL, roomId, channel)
  }

  const createChannel = () => {
    if (!socket.id) {
      return
    }

    if (joinedId) {
      const channel = groupChannels.filter(c => c.channelId === joinedId)[0]
      const creator = channel.users.filter(u => u.creator)[0]

      if (creator?.id === user.id) {
        return console.warn('Already created channel')
      } else {
        leaveChannel()
      }
    }

    const channelId = v4()

    const channel: Channel = {
      name: `${user.name}'s channel`,
      channelId,
      users: [{
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        creator: true,
        socketId: socket.id,
      }]
    }

    setJoinedId(channelId)
    setGroupChannels(prev => [...prev, channel])

    socket.emit(ACTIONS.CREATE_CHANNEL, roomId, channel)
  }
  
  useEffect(() => {
    const onShare = (channel: Channel[]) => {
      console.log('shara', channel)
      setGroupChannels(channel)
    }


    console.log(groupChannels)

    socket.on(ACTIONS.SHARE_CHANNELS, onShare)
    return () => {
      socket.off(ACTIONS.SHARE_CHANNELS, onShare)
    }
  }, [groupChannels])

  useEffect(() => {
    socket.emit(ACTIONS.GET_CHANNELS, roomId)
  }, [])

  return {
    joinedId,
    groupChannels,
    joinChannel,
    leaveChannel,
    createChannel
  }
}