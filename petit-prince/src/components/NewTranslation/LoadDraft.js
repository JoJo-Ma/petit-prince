import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';

const LoadDraft = () => {
  const username = useStoreState(state => state.naming.name)
  const [ drafts, setDrafts ] = useState([])
  const [ selectedDraft, setSelectedDraft ] = useState("")

  const handleChange = (e) => {
    setSelectedDraft(e.target.value)
  }

  useEffect( async () => {
    const response = await fetch (`http://localhost:3005/translations/${username}/drafts`)

    const parseRes = await response.json()

    setDrafts(parseRes)
  }, [])

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body = { username, name: selectedDraft }
      const response = await fetch("http://localhost:3005/translations/drafts", {
        method: "GET",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
      })



    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <h3>Load Draft</h3>
      <form onSubmit={onSubmitForm}>

      </form>
      <select onChange={(e) => handleChange(e)}>
        {drafts.map((draft, index) => {
          return <option key={index} value={draft.name}>{draft.name}</option>
        })}
      </select>
    </>
  )


}

export default LoadDraft;
