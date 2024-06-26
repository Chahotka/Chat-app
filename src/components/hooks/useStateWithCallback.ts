import { useCallback, useEffect, useRef, useState } from "react"

export const useStateWithCallback = (initialState: string[]) => {
  const cbRef = useRef<Function | null>(null)
  const [state, setState] = useState(initialState)

  const updateState = useCallback((newState: Function | [], cb: Function) => {
    console.log('adding new client')
    cbRef.current = cb

    setState(prev =>
      typeof newState === 'function'
        ? newState(prev)
        : newState
    )
  }, [state])

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state)
      cbRef.current = null
    }
  }, [state])

  return { state, updateState }
}