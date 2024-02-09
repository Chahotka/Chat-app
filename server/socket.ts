import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { app } from './index'

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
  },
  onConnected: (userId: string) => {
    io.emit('connected', userId)
  },
  onDisconnect: (socket: socketType) => {
    console.log(socket.id, ' - DISCONNECTED')
  },
  onJoin: (socket: socketType, roomId: string) => {
    socket.join(roomId)

    io.to(roomId).emit('joined', socket.id, roomId)
  },
  onLeave: (socket: socketType, roomId: string) => {
    io.to(roomId).emit('left', socket.id, roomId)

    socket.leave(roomId)
  }
}