import { useEffect, useState } from 'react';
import { baseUrl } from '../../Util/apiUrl';

const useFetchIssue = (id="") => {
  const [ issueLog, setIssueLog] = useState([])
  const [click, setClick] = useState(false)

  const triggerReloadClick = () => {
    setClick(prev => !prev)
  }

  useEffect( () => {
    const abortController = new AbortController()
    const fetchData = async () => {
      const response = await fetch (`${baseUrl}/issuelog/${id}`, {
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
  }, [click])

  return { issueLog, triggerReloadClick }
}

export default useFetchIssue;
