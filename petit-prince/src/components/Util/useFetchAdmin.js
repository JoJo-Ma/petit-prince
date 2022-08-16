import { useState, useEffect } from 'react'
import { baseUrl } from './apiUrl'

const useFetchAdmin = (dependencyArray) => {
  const [ adminStatus, setAdminStatus] = useState([])


  useEffect( () => {
    console.log(dependencyArray);
    const fetchData = async () => {
    const response = await fetch (`${baseUrl}/auth/isadmin/`, {
          method: "GET",
          headers: {token : localStorage.token}
        })
      const parseRes = await response.json()

      setAdminStatus(parseRes.admin)
    }
    fetchData()
  }, dependencyArray)

  return { adminStatus }
}

export default useFetchAdmin;
