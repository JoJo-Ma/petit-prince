import { useEffect, useState } from 'react';

const useFetchLanguages = () => {
  const [ languages, setLanguages] = useState([])


  useEffect( async () => {
    const response = await fetch ("http://localhost:3005/languages")

    const parseRes = await response.json()

    setLanguages(parseRes)
  }, [])

  return { languages }
}

export default useFetchLanguages;
