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
    console.log(socket.id, ' - CONNECTED')
    socket.emit('connected', socket.id)
  },
  onDisconnect: (socket: socketType) => {
    console.log(socket.id, ' - DISCONNECTED')
  },
  onJoin: (socket: socketType, roomIds: string[]) => {
    for (const roomId of roomIds) {
      socket.join(roomId)
      io.to(roomId).emit('joined', socket.id, roomId)
    }
  },
  onGetMessages: async (socket: socketType, roomId: string) => {
    const messages = await dbHandler.getMessages(roomId)

    io.to(roomId).emit('last message', messages, roomId, socket.id)
    io.to(roomId).emit('messages history', messages, roomId, socket.id)
  },
  onLeave: (socket: socketType, roomId: string) => {
    io.to(roomId).emit('left', socket.id, roomId)

    socket.leave(roomId)
  },
  onSendMessage: async (socket: socketType, messageObject: Message) => {
    await dbHandler.sendMessage(messageObject)
    io.to(messageObject.roomId).emit('message sended', messageObject)
  }
}