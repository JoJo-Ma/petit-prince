import { useEffect, useState } from 'react';
import { baseUrl } from './apiUrl';

const useFetchNotifications = (username) => {
  const [ notifications, setNotifications] = useState([])
  const [click, setClick] = useState(false)

  const triggerReloadNotifications = () => {
    setClick(prev => !prev)
  }

  useEffect( () => {
    const fetchData = async () => {
      const response = await fetch (`${baseUrl}/notifications/${username}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })

      const parseRes = await response.json()

      setNotifications(parseRes)
    }
    if(!username) return
    fetchData()
  }, [username, click])

  return { notifications, triggerReloadNotifications }
}

export default useFetchNotifications;
