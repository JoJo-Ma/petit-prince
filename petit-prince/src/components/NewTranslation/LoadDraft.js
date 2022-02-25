import React, { useState, useEffect, useRef } from 'react';
import { useStoreState } from 'easy-peasy';
import useFetchDrafts from './useFetchDrafts'

const LoadDraft = ({ loadData }) => {
  const username = useStoreState(state => state.naming.name)
  const [{loading : loadingDraftList, drafts : draftList, error : errorDraftList}, doFetchDrafts] = useFetchDrafts(username)
  const [ selectedDraft, setSelectedDraft ] = useState(false)
  const [{loading : loadingRetrievedDraft, drafts : retrievedDraft, errorRetrievedDRaft}, doFetchDraft] = useFetchDrafts(username, selectedDraft)
  const isDrafts = draftList.length > 0 ? true : false
  const isInitialMount = useRef(true);

  const handleChange = (e) => {
    setSelectedDraft(e.target.value)
  }

  useEffect(() => {
    //will skip first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
        loadData(retrievedDraft)
    }
  }, [retrievedDraft])

  return (
    <>
      <h3>Load Draft</h3>
      <select onChange={(e) => handleChange(e)}>
      {draftList.map((draft, index) => {
        return <option key={index} value={draft.name}>{draft.name}</option>
      })}
      </select>
      { isDrafts ? <button onClick={doFetchDraft} disabled={!selectedDraft}>Load</button> : <p>No drafts saved yet</p>}
    </>
  )


}

export default LoadDraft;
