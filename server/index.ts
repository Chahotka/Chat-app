import express, { Request, Response } from 'express'
import bp from 'body-parser'
import dotenv from 'dotenv/config'
import cors from 'cors'
import { v4 } from 'uuid'
import { dbHandler } from './firebase'
import { io, httpServer, socketHandler } from './socket'
import { hashPassword } from './hashPassword'
import { Sign } from './interfaces/Sign'
import { DocumentData } from 'firebase-admin/firestore'
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
  const userNameOrId = req.body.searchText.toLowerCase()
  const searchBy = req.body.searchBy
  const userResponse = await dbHandler.searchUser(userNameOrId, searchBy)

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
    rooms.push({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      roomId: user.roomId
    })
  })

  res.send(rooms)
})

app.listen(5000, () => {
  console.log('Listen on port: ', 5000, ' blya')
})

// SOCKET.IO

io.on('connect', (socket) => {
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

  socket.on('disconnect', () => 
    socketHandler.onDisconnect(socket)
  )
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