import { useEffect, useState } from 'react';

const useFetchLanguages = () => {
  const [ languages, setLanguages] = useState([])


  useEffect( () => {
    const fetchData = async () => {
      const response = await fetch ("http://localhost:3005/languages")

      const parseRes = await response.json()

      setLanguages(parseRes)
    }
    fetchData()
  }, [])

  return { languages }
}

export default useFetchLanguages;
