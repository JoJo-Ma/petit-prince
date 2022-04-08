import { useState, useEffect } from 'react'

const useFetchDraft = (username, draftName = "") => {
  const [ loading, setLoading] = useState(false)
  const [ drafts, setDrafts ] = useState([])
  const [ error, setError] = useState(false)
  const [ click, setClick ] = useState(true)

  const handleClick = async () => {
    setClick(prev => !prev)
  }


  useEffect(() => {
    const call = async () => {
      try {
        setError(null)
        setLoading(true)
        const response = await fetch (`http://localhost:3005/translations/${username}/drafts/${draftName}`, {
          method: "GET",
          headers: {token : localStorage.token}
        })
        const parseRes = await response.json()
        setDrafts(parseRes)
      } catch (error) {
        console.error(error.message);
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    if(draftName === false) return
    call()
  }, [click])
  return [{loading, drafts, error}, handleClick]
}

export default useFetchDraft;
