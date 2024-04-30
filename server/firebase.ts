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
        type: 'direct',
        usersId: [creator, user],
        messages: [],
        roomId 
      })
    }
  },
  getRooms: async (rooms: {userId?: string, usersId?: string[], roomId: string}[]) => {
    const roomsData: DocumentData[] = []
    const usersRef = db.collection('users_list')

    for (let room of rooms) {
      if (typeof room.userId === 'string') {
        const userData = (await usersRef.doc(room.userId).get()).data()

        roomsData.push({
          type: 'direct',
          ...userData,
          roomId: room.roomId
        })
      }

      if (typeof room.usersId !== 'undefined') {
        const groupUsers: DocumentData[] = []

        for (let userId of room.usersId) {
          const userData = (await usersRef.doc(userId).get()).data()

          if (typeof userData !== 'undefined') {
            groupUsers.push(userData)
          }
        }

        roomsData.push({
          type: 'group',
          users: groupUsers,
          roomId: room.roomId
        })
      }
    }

    return roomsData
  },
  sendMessage: async (messageObject: Message) => {
    const roomRef = db.collection('rooms_messages').doc(messageObject.roomId)
    await roomRef.update({
      messages: FieldValue.arrayUnion(messageObject)
    })
  },
  getMessages: async (roomId: string) => {
    const roomRef = db.collection('rooms_messages').doc(roomId)
    const doc = await roomRef.get()

    if (!doc.exists) {
      return []
    } 
    
    const data = doc.data()
    if (!data || !data.messages || data.messages.length === 0) {
      return []
    } else {
      return data.messages
    }
  },
  createGroup: async (groupId: string, creator: string, selectedUsers: string[]) => {
    const usersRef = db.collection('users_list')
    const creatorRef = db.collection('users_list').doc(creator)
    const groupRef = db.collection('rooms-messages').doc(groupId)

    const creatorData = (await creatorRef.get()).data()

    if (typeof creatorData !== 'undefined') {
      const creatorRooms = creatorData.rooms || []

      await creatorRef.update({rooms: [...creatorRooms, {roomId: groupId, usersId: selectedUsers}]})
    }

    for (let userId of selectedUsers) {
      const filteredUsers = selectedUsers.filter(id => id !== userId)


      const userRef = usersRef.doc(userId)
      const userData = (await userRef.get()).data()

      if (typeof userData !== 'undefined') {
        const userRooms = userData.rooms || []

        await userRef.update({rooms: [...userRooms, {roomId: groupId, usersId: [creator, ...filteredUsers]}]})
      }
    }

    await db.collection('rooms_messages').doc(groupId).set({
      type: 'group',
      users: [creator, ...selectedUsers],
      messages: [],
      roomId: groupId
    })
  }
}

