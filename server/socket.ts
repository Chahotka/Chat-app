import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

type socketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export const socketHandler = {
  onConnect: (socket: socketType) => {
    console.log(socket.id, ' - CONNECTED')
  },
  onDisconnect: (socket: socketType) => {
    console.log(socket.id, ' - DISCONNECTED')
  }
}