import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { app } from './index'
import { Message } from './interfaces/Message'
import { dbHandler } from './firebase'

type socketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

export const socketHandler = {
  onConnect: (socket: socketType) => {
    socket.emit('connected', socket.id)
  },
  onDisconnect: (socket: socketType) => {
  },
  onJoin: (socket: socketType, roomIds: string[]) => {
    for (const roomId of roomIds) {
      socket.join(roomId)
      io.to(roomId).emit('joined', socket.id, roomId, roomIds)
    }
  },
  onGetMessages: async (socket: socketType, roomId: string) => {
    const messages = await dbHandler.getMessages(roomId)
    io.to(socket.id).emit('messages history', messages, roomId, socket.id)
  },
  onLeave: (socket: socketType, roomId: string) => {
    io.to(roomId).emit('left', socket.id, roomId)

    socket.leave(roomId)
  },
  onSendMessage: async (socket: socketType, messageObject: Message) => {
    io.to(messageObject.roomId).emit('message sended', messageObject)
    // await dbHandler.sendMessage(messageObject)
  },
  onOffer: (socket: socketType, offer: RTCSessionDescription, roomId: string) => {
    io.to(roomId).emit('receive offer', offer, socket.id)
  },
  onAnswer: (answer: RTCSessionDescription, callerId: string) => {
    io.to(callerId).emit('receive answer', answer, callerId)
  },
  onCandidate: (socket: socketType, candidate: RTCIceCandidate, roomId: string) => {
    io.to(roomId).emit('receive candidate', candidate, socket.id)
  }
}