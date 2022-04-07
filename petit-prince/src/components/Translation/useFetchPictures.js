import { useEffect, useState } from 'react';

const useFetchPictures = () => {
  const [ pictures, setPictures] = useState([])


  useEffect( async () => {
    const response = await fetch ("http://localhost:3005/pictures", {
      method: "GET",
      headers: {token : localStorage.token}
    })
    const parseRes = await response.json()

    setPictures(parseRes)
  }, [])

  return { pictures }
}

export default useFetchPictures;
