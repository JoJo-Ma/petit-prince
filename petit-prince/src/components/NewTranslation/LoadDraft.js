import React, { useState, useEffect, useRef } from 'react';
import { useStoreState } from 'easy-peasy';
import useFetchDrafts from '../Util/useFetchDrafts'
import Select from 'react-select'

const LoadDraft = ({ loadData }) => {
  const username = useStoreState(state => state.naming.name)
  const [{loading : loadingDraftList, drafts : draftList, error : errorDraftList}, doFetchDrafts] = useFetchDrafts(username)
  const [ selectedDraft, setSelectedDraft ] = useState(false)
  const [{loading : loadingRetrievedDraft, drafts : retrievedDraft, errorRetrievedDRaft}, doFetchDraft] = useFetchDrafts(username, selectedDraft)
  const isDrafts = draftList.length > 0 ? true : false
  const isInitialMount = useRef(true)
  const [options, setOptions] = useState(null)

  const handleChange = (e) => {
    setSelectedDraft(draftList.find(draft => draft.name === e.value))
  }

  useEffect(() => {
    //will skip first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
        loadData(retrievedDraft)
    }
  }, [retrievedDraft])

  useEffect(() => {
    setOptions(draftList.map((draft, index) => {
      return {
        value: draft.name,
        label: draft.name
      }
    }) )
  }, [draftList])

  return (
    <>
      <h3>Load Draft</h3>
      <Select className="react-select-container"
          classNamePrefix="react-select"
          options={options}
          onChange={(e) => handleChange(e)}
          placeholder={'Select draft...'}
          theme={(theme) => ({
            ...theme,
            borderRadius:0,
            colors: {
              ...theme.colors,
              primary: '#408CA2',
              primary25: '#AFD8E5'
            }
          })}
          openMenuOnFocus={true}
           />
      { isDrafts ? <button onClick={doFetchDraft} disabled={!selectedDraft}>Load</button> : <p>No drafts saved yet</p>}
    </>
  )


}

export default LoadDraft;
