import { useEffect, useState } from 'react';

const useFetchIssue = (id="") => {
  const [ issueLog, setIssueLog] = useState([])


  useEffect( () => {
    const abortController = new AbortController()
    const fetchData = async () => {
      const response = await fetch (`http://localhost:3005/issuelog/${id}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })

      const parseRes = await response.json()
      if (id === "") {
        setIssueLog(parseRes)
        return
      }
      setIssueLog(parseRes[0])
    }
    fetchData()

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return { issueLog }
}

export default useFetchIssue;
