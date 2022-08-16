import { useEffect, useState } from 'react';
import { baseUrl } from '../Util/apiUrl';

const useFetchLanguages = () => {
  const [ languages, setLanguages] = useState([])


  useEffect( () => {
    const abortController = new AbortController()
    const fetchData = async () => {
      const response = await fetch (`${baseUrl}/languages`)

      const parseRes = await response.json()

      setLanguages(parseRes)
    }
    fetchData()

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return { languages }
}

export default useFetchLanguages;
