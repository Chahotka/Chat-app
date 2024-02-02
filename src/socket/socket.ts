import { io } from 'socket.io-client'

export const socket = io('http://localhost:5001', {
  autoConnect: false
})

export const socketHandler = {
  onJoin: (roomId: string) => {
    socket.emit('join', roomId)
    console.log('Socket: ', socket.id, ' Joining room - ', roomId)
  }
}