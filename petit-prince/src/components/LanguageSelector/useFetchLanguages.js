import { useEffect, useState } from 'react';

const useFetchLanguages = () => {
  const [ languages, setLanguages] = useState([])


  useEffect( () => {
    const abortController = new AbortController()
    const fetchData = async () => {
      const response = await fetch ("http://localhost:3005/languages")

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
