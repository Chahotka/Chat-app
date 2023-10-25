import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export const useError = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    return error.message
  } else if (typeof error === 'string') {
    return error
  } else {
    console.error(error)
    return 'Unknown error'
  }
}