import { useState, useEffect } from 'react'

const useAlert = (delay) => {
  const [ alert, setAlert] = useState(null)


  useEffect(() => {
    if (alert === null) return
    const timer = setTimeout(() => setAlert(null), delay)
    return () => clearTimeout(timer)
  }, [alert])

  return { alert, setAlert }
}

export default useAlert;
