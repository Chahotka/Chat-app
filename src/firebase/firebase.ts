import { initializeApp } from 'firebase/app'
import { 
  getFirestore, 
  collection,
  doc, getDoc, setDoc,
  Timestamp
} from 'firebase/firestore'
import { useAppDispatch } from '../app/hooks'

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)


export const dbHandler = {
  addUser: async (
    id: string,
    nick: string,
    salt: number,
    email: string,
    avatar: string,
    password: number,
    verificated: boolean
  ) => {
    await setDoc(doc(db, 'users_list', id), {
      id,
      nick,
      salt,
      email,
      avatar,
      password,
      verificated,
      createdAt: Timestamp.now().seconds
    })

    return
  },
  getUser: async () => {
    const docRef = doc(db, 'users_list', 'id')
    const docSnap = await getDoc(docRef)


    if (docSnap.exists()) {
      console.log('Document data: ', docSnap.data())
    } else {
      console.log('no such document!')
    }
  }
}