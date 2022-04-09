import { useEffect, useState } from 'react';

const useFetchAvailableRecording = (language) => {
  const [ usernames, setUsernames] = useState([])


  useEffect( () => {
    const fetchData = async () => {
      const response = await fetch (`http://localhost:3005/blobtesting/StatusRecording/${language}`)

      const parseRes = await response.json()

      setUsernames(parseRes)
    }
    fetchData()
  }, [language])

  return { usernames }
}

export default useFetchAvailableRecording;
