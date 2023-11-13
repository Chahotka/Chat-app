import React, { useEffect, useState } from 'react'
import { dbHandler } from '../../firebase/firebase'
import { DocumentData, Timestamp } from 'firebase/firestore'
import { useFetch } from '../hooks/useFetch'

const Confirmation: React.FC = () => {
  const [verified, setVerified] = useState(false)
  const { fetching, loading, error } = useFetch(async() => {
    const response: DocumentData | false = await dbHandler.getUser(window.location.pathname.split('confirmation/')[1])
    
    if (response) {
      if (response.verificated) {
        return setVerified(true)
      }

      const num = response.createdAt
      const now = Timestamp.now().seconds

      if (now - num < 600) {
        dbHandler.verifyUser(window.location.pathname.split('confirmation/')[1])
      }
    }
  })

  useEffect(() => {
    fetching()
  }, [])


  return (
    <div>
      { verified ?
        <p>Email verified</p>
      :
        <p>Vse huevo</p>
      }
    </div>
  )
}

export default Confirmation