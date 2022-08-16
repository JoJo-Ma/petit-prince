import { useEffect, useState } from 'react';
import { baseUrl } from '../Util/apiUrl';

const useFetchPictures = () => {
  const [ pictures, setPictures] = useState([])


  useEffect( () => {
    const fetchData = async () => {
      const response = await fetch (`${baseUrl}/pictures`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()

      setPictures(parseRes)
    }
    fetchData()
  }, [])

  return { pictures }
}

export default useFetchPictures;
