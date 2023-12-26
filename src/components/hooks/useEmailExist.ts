export const useEmailExist = (email: string | null) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email})
  }

  const checkEmail = async () => {
    const response = await fetch('http://localhost:5000/check-exist', options)
    const emailInUse = await response.json()

    return emailInUse
  }

  return checkEmail
}