import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { DocumentData, FieldValue, getFirestore } from 'firebase-admin/firestore'
import serviceKey from './serviceKey.json'
import { User } from './interfaces/User'
import { Message } from './interfaces/Message'

const serviceAccount = serviceKey as ServiceAccount

const app = initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()

export const dbHandler = {
  addUser: async (user: User) => {
    const email = user.email.toLowerCase()
    const docRef = db.collection('users_list').doc(user.id)

    await docRef.set({
      id: user.id,
      name: user.name,
      email,
      avatar: user.avatar,
      salt: user.salt,  
      password: user.password,
      verificated: false
    })
  },
  getUser: async (email: string) => {
    const userRef = db.collection('users_list')
    const snapshot = await userRef.where('email', '==', email).get()

    return snapshot.docs[0].data()
  },
  searchUser: async (searchText: string, searchBy: string) => {
    const userRef = db.collection('users_list')
    const snapshot = await userRef.where(searchBy, '==', searchText).get()

    if (snapshot.empty) {
      return {
        status: 'error',
        res: `No such user with this ${searchBy}: ${searchText}`
      }
    } else {
      return {
        status: 'success',
        res: snapshot.docs[0].data()
      }
    }
  },
  checkExist: async (email: string) => {
    const usersRef = db.collection('users_list')
    const snapshot = await usersRef.where('email', '==', email).get()
  
    return !snapshot.empty
  },
  addRoom: async (creator: string, user: string, roomId: string) => {
    const creatorRef = db.collection('users_list').doc(creator)
    const userRef = db.collection('users_list').doc(user)

    const creatorData = (await creatorRef.get()).data()
    const userData = (await userRef.get()).data()

    if (typeof creatorData !== 'undefined' && typeof userData !== 'undefined') {
      const creatorRooms = creatorData.rooms || []
      const userRooms = userData.rooms || []

      await creatorRef.update({rooms: [...creatorRooms, {roomId, userId: user}]})
      await userRef.update({rooms: [...userRooms, {roomId, userId: creator}]})
      
      await db.collection('rooms_messages').doc(roomId).set({
        user1: creator,
        user2: user,
        messages: [],
        roomId 
      })
    }
  },
  getRooms: async (roomsId: {userId: string, roomId: string}[]) => {
    const rooms: DocumentData[] = []
    const usersRef = db.collection('users_list')
    
    for (const element of roomsId) {
      const userDoc = await usersRef.doc(element.userId).get()
      const userData = userDoc.data()

      if (typeof userData !== 'undefined') {
        rooms.push({
          ...userData,
          roomId: element.roomId
        })
      }
    }

    return rooms
  },
  sendMessage: async (messageObject: Message) => {
    const roomRef = db.collection('rooms_messages').doc(messageObject.roomId)
    const unionRes = await roomRef.update({
      messages: FieldValue.arrayUnion(messageObject)
    })

    console.log(unionRes)
  },
  getMessages: async (roomId: string) => {
    const roomRef = db.collection('rooms_messages').doc(roomId)
    const doc = await roomRef.get()

    if (!doc.exists) {
      return []
    } 
    
    const data = doc.data()

    if (!data || !data.messages) {
      return []
    } else {
      return data.messages
    }
  }
}

