import { useState, useEffect } from 'react'

const useFetchAdmin = (dependencyArray) => {
  const [ adminStatus, setAdminStatus] = useState([])


  useEffect( () => {
    const fetchData = async () => {
    const response = await fetch (`http://localhost:3005/auth/isadmin/`, {
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
