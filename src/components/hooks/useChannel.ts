import { useState } from "react"
import { Channel } from "./useWebRTC"
import { useAppSelector } from "../../app/hooks"
import { v4 } from "uuid"

export const useChannel = () => {
  const user = useAppSelector(state => state.user)
  
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


  
  const leaveChannel = (joining: boolean) => {
    if (!joinedId) {
      return groupChannels
    }
    if (!joining) {
      setJoinedId(undefined)
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

    const joined = groupChannels.filter(channel => channel.channelId === joinedId)[0]
    
    if (joined) {
      const channelUser = joined.users.filter(channelUser => channelUser.id === user.id)[0]

      if (channelUser && channelUser.creator) {
        return console.warn('You already created room')
      } else {

        joined.users = joined.users.filter(channelUser => channelUser.id !== user.id)
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

  return {
    joinedId,
    groupChannels,
    joinChannel,
    leaveChannel,
    createChannel
  }
}