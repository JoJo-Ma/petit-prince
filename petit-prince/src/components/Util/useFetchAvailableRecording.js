import { useEffect, useState } from 'react';
import { baseUrl } from './apiUrl';

const useFetchAvailableRecording = (language) => {
  const [ usernames, setUsernames] = useState([])


  useEffect( () => {
    const fetchData = async () => {
      const response = await fetch (`${baseUrl}/blobtesting/StatusRecording/${language.id}`)

      const parseRes = await response.json()

      setUsernames(parseRes)
    }
    if(!language) return
    fetchData()
  }, [language])

  return { usernames }
}

export default useFetchAvailableRecording;
