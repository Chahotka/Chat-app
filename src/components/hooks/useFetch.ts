import { useState } from "react";

export const useFetch = (
  callback: Function,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const [loading, setLoading] = useState(false)


  const fetching = async (e: React.MouseEvent) => {
    try {
      setError('')
      setLoading(true)
      await callback(e)
    } catch (e) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  return { loading, fetching }
}