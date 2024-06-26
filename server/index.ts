import express, { Request, Response } from 'express'
import util from 'node:util'
import bp from 'body-parser'
import dotenv from 'dotenv/config'
import cors from 'cors'
import { v4 } from 'uuid'
import { dbHandler } from './firebase'
import { io, httpServer, socketHandler } from './socket'
import { hashPassword } from './hashPassword'
import { Sign } from './interfaces/Sign'
import { DocumentData } from 'firebase-admin/firestore'
import { ACTIONS } from './modules/Actions'
dotenv

export const app = express()

app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))


app.post('/check-exist', async (req: Request, res: Response) => {
  if (!req.body.email) {
    res.send(false)
  }

  const email = req.body.email.toLowerCase()
  const exist = await dbHandler.checkExist(email)

  res.send(exist)
})
app.post('/sign-up', async (req: Request, res: Response) => {
  const data: Sign = req.body
  const email = data.email.toLowerCase()
  const { hash, salt } = hashPassword(data.password)

  await dbHandler.addUser({
    id: v4(),
    name: data.name,
    email: email,
    avatar: null,
    salt: salt,
    password: hash
  })

  const exist = await dbHandler.checkExist(email)

  res.send(exist)
})
app.post('/sign-in', async (req: Request, res: Response) => {
  const data: Sign = req.body
  const response = await dbHandler.getUser(data.email.toLowerCase())

  if (typeof response === 'undefined') {
    res.send(false)
    return
  }

  const { hash } = hashPassword(data.password, response.salt)

  if (response.password === hash) {
    res.send(response)
  } else {
    res.send(false)
  }
})
app.post('/add-user', async (req: Request, res: Response) => {
  const userEmailOrId = req.body.searchText.toLowerCase()
  const searchBy = req.body.searchBy
  const userResponse = await dbHandler.searchUser(userEmailOrId, searchBy)

  if (typeof userResponse.res === 'object') {
    const roomId = v4()

    const userData = {
      id: userResponse.res.id,
      name: userResponse.res.name,
      email: userResponse.res.email,
      avatar: userResponse.res.avatar,
      roomId
    }

    await dbHandler.addRoom(req.body.creator, userResponse.res.id, roomId)

    res.send({ ...userResponse, res: userData })
  } else {
    res.send(userResponse)
  }


})
app.post('/get-rooms', async (req: Request, res: Response) => {
  const usersList = await dbHandler.getRooms(req.body)
  const rooms: DocumentData[] = []

  usersList.forEach(user => {
    if (user.type === 'direct') {
      rooms.push({
        type: user.type,
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roomId: user.roomId
      })
    } else if (user.type === 'group') {
      rooms.push({
        type: user.type,
        name: user.name,
        creator: user.creator,
        users: user.users,
        roomId: user.roomId,
      })
    }
  })

  res.send(rooms)
})
app.post('/create-group', async (req: Request, res: Response) => {
  const { groupId, creatorId, groupName, selectedUsers } = req.body

  const response = await dbHandler.createGroup(groupName, groupId, creatorId, selectedUsers)

  res.send(response)
})

app.listen(5000, () => {
  console.log('Listen on port: ', 5000, ' blya')
})

// SOCKET.IO


type Channel = {
  name: string,
  channelId: string
  users: {
    id: string,
    name: string,
    avatar: string | null
    socketId: string
  }[]
}

type ChannelList = {
  [key: string]: {
    roomId: string,
    channels: Channel[]
  }
}

const channels: ChannelList = {}


io.on('connect', (socket) => {
  console.log('SOCKET ', socket.id, ' CONNECTED')
  socketHandler.onConnect(socket)

  socket.on('join rooms', (roomIds) => {
    socketHandler.onJoin(socket, roomIds)
  })

  socket.on('get messages', (roomId) => {
    socketHandler.onGetMessages(socket, roomId)
  })

  socket.on('send message', (messageObject) => {
    socketHandler.onSendMessage(socket, messageObject)
  })

  socket.on(ACTIONS.ASK_PERMISSION, ({ caller, roomId }) => {
    const clients = io.sockets.adapter.rooms.get(roomId) || []

    Array.from(clients).forEach(clientId => {
      if (clientId !== socket.id) {
        io.to(clientId).emit(ACTIONS.CALL_PERMISSION, {
          callerName: caller,
          callerId: socket.id
        })
      }
    })
  })
  socket.on(ACTIONS.CALL, ({ roomId }) => {
    console.log('CALLING EVENT')
    const clients = io.sockets.adapter.rooms.get(roomId) || []
    console.log('CLIENTS: ', clients)
    Array.from(clients).forEach(clientId => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: true
      })

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: false
      })
    })
  })
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, iceCandidate }) => {
    console.log('RELAY ICE EVENT')
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      iceCandidate
    })
  })
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    console.log('RELAY SDP EVENT')
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription
    })
  })
  socket.on(ACTIONS.HIDE_CAM, ({ hide, clientId, roomId }) => {
    console.log('suka cam')

    io.to(roomId).emit(ACTIONS.HANDLE_CAM, {
      hide,
      userId: clientId
    })
  })

  const leaveRoom = (roomId?: string) => {
    if (roomId) {
      const clients = io.sockets.adapter.rooms.get(roomId) || []

      Array.from(clients).forEach(clientId => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id
        })
      })
    }
  }

  const leaveChannel = (roomId?: string, channel?: Channel) => {
    if (roomId && channel) {
      const filteredChannels = channels[roomId].channels.filter(c => c.channelId !== channel.channelId)
  
      channels[roomId].channels = channel.users.length > 0
        ? [...filteredChannels, channel]
        : filteredChannels
  
      const sockets = io.sockets.adapter.rooms.get(roomId) || []
  
  
      Array.from(sockets).forEach(client => {
        if (client !== socket.id) {
          io.to(client).emit(ACTIONS.SHARE_CHANNELS, channels[roomId].channels)
        }
      })
    } else {
      for (let key in channels) {
        const groups = channels[key].channels
        groups.map(c => {
          c.users = c.users.filter(u => u.socketId !== socket.id)
        })
  
        channels[key].channels = groups.filter(c => c.users.length > 0)
  
        io.to(channels[key].roomId).emit(ACTIONS.SHARE_CHANNELS, channels[key].channels)
      }
  
      console.log(util.inspect(channels, {depth: null, colors: true}))
      console.log('SOCKET - ', socket.id, ' DISCONNECTED')
    }
  }

  socket.on(ACTIONS.STOP_CALL, (roomId) => leaveRoom(roomId))

  // ===========================

  socket.on(ACTIONS.GET_CHANNELS, (roomId: string) => {






    if (channels[roomId]) {
      socket.emit(ACTIONS.SHARE_CHANNELS, channels[roomId].channels)
    }
  })

  socket.on(ACTIONS.CREATE_CHANNEL, (roomId: string, channel: Channel) => {
    if (roomId in channels) {
      channels[roomId].channels.push(channel)
    } else {
      channels[roomId] = {
        roomId,
        channels: [channel]
      }
    }

    const clients = io.sockets.adapter.rooms.get(roomId) || []

    Array.from(clients).forEach(client => {
      if (client !== socket.id) {
        io.to(client).emit(ACTIONS.SHARE_CHANNELS, channels[roomId].channels)
      }
    })
  })

  socket.on(ACTIONS.JOIN_CHANNEL, (roomId: string, channel: Channel) => {
    const filteredChannels = channels[roomId].channels.filter(c => c.channelId !== channel.channelId)

    channels[roomId].channels = [...filteredChannels, channel]

    const clients = io.sockets.adapter.rooms.get(roomId) || []

    Array.from(clients).forEach(client => {
      if (socket.id !== client) {
        console.log(client)
        io.to(roomId).emit(ACTIONS.SHARE_CHANNELS, channels[roomId].channels)
      }
    })
  })

  socket.on(ACTIONS.LEAVE_CHANNEL, (roomId: string, channel: Channel) => {
    leaveChannel(roomId, channel)
  })


  socket.on('disconnect', () => {
    leaveChannel()
    leaveRoom()
  })

  // ==================================

  socket.on('connection_error', (err) => {
    console.log(err.req)
    console.log(err.code)
    console.log(err.message)
    console.log(err.context)
  })
})

io.on('connection_error', (err) => {
  console.log(err.req)
  console.log(err.code)
  console.log(err.message)
  console.log(err.context)
})

httpServer.listen(5001)