import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';

const LoadDraft = ({ loadData }) => {
  const username = useStoreState(state => state.naming.name)
  const [ drafts, setDrafts ] = useState([])
  const [ selectedDraft, setSelectedDraft ] = useState("")

  const handleChange = (e) => {
    setSelectedDraft(e.target.value)
  }

  useEffect( async () => {
    const response = await fetch (`http://localhost:3005/translations/${username}/drafts`, {
      method: "GET",
      headers: {token : localStorage.token}
    })

    const parseRes = await response.json()

    setDrafts(parseRes)
  }, [])

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3005/translations/${username}/drafts/${selectedDraft}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })

      const { urlInput, output, discardedList, lastAction, newTranslationList, newTranslationListId, selected } = await response.json()

      loadData(urlInput, output, discardedList, lastAction, newTranslationList, newTranslationListId, selected)


    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <h3>Load Draft</h3>
      <form onSubmit={onSubmitForm}>
        <select onChange={(e) => handleChange(e)}>
        {drafts.map((draft, index) => {
          return <option key={index} value={draft.name}>{draft.name}</option>
        })}
        </select>
        <button>Submit</button>
      </form>
    </>
  )


}

export default LoadDraft;
