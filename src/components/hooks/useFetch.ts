import { useState } from "react";

export const useFetch = (
  callback: Function,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const [loading, setLoading] = useState(false)

  const fetching = async () => {
    try {
      setMessage('')
      setLoading(true)
      await callback()
    } catch (e) {
      console.error('Ebat error occured: ', e)
      setMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  return { loading, fetching }
}