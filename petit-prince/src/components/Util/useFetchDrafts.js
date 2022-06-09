import { useState, useEffect } from 'react'

const useFetchDraft = (username, draftName = "", reload=false) => {
  const [ loading, setLoading] = useState(true)
  const [ drafts, setDrafts ] = useState([])
  const [ error, setError] = useState(true)
  const [ click, setClick ] = useState(true)
  const [ clickDelete, setClickDelete] = useState(true)


  const handleClick = async () => {
    setClick(prev => !prev)
  }
  const handleClickDelete = async () => {
    setClickDelete(prev => !prev)
  }



  useEffect(() => {
    if (!username) return
    const abortController = new AbortController()
    const call = async () => {
      try {
        setLoading(true)
        console.log('fetching drafts');
        //dirty fix because react select returns an object
        const draft = draftName.length == "" ? draftName : draftName.name
        const response = await fetch (`http://localhost:3005/translations/${username}/drafts/${draft}`, {
          method: "GET",
          headers: {token : localStorage.token}
        })
        const parseRes = await response.json()
        if (typeof parseRes !== 'object') throw `error ${parseRes}`
        setDrafts(parseRes)
        setError(false)
      } catch (error) {
        console.error(error.message);
        setDrafts([])
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if(draftName === false) return
    call()
    return function cleanup() {
      abortController.abort()
    }
  }, [click, username])

  useEffect(() => {

    const call = async () => {
      try {
        const draft = draftName.name
        const response = await fetch (`http://localhost:3005/translations/${username}/drafts/${draft}`, {
          method: "DELETE",
          headers: {token : localStorage.token}
        })
        const parseRes = await response.text()
        console.log(parseRes);
        setError(false)
      } catch (error) {
        console.error(error.message);
        setDrafts([])
        setError(true)
      } finally {
        setLoading(true)
      }
    }
    if (draftName === false || draftName === undefined || draftName==='') {
      return
    }
    call()
  }, [clickDelete])
  return [{loading, drafts, error}, handleClick, handleClickDelete]
}

export default useFetchDraft;
