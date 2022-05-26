import React, { useState, useEffect, useRef } from 'react';
import { useStoreState } from 'easy-peasy';
import useFetchDrafts from '../Util/useFetchDrafts'
import Select from 'react-select'
import ConfirmButton from './ConfirmButton'

const LoadDraft = ({ loadData, updateDraft }) => {
  const username = useStoreState(state => state.naming.name)
  const [{loading : loadingDraftList, drafts : draftList, error : errorDraftList}, doFetchDrafts] = useFetchDrafts(username)
  const [ selectedDraft, setSelectedDraft ] = useState(false)
  const [{loading : loadingRetrievedDraft, drafts : retrievedDraft, error : errorRetrievedDRaft}, doFetchDraft, doDeleteDraft] = useFetchDrafts(username, selectedDraft)
  const isDrafts = draftList.length > 0 ? true : false
  const isInitialMount = useRef(true)
  const [options, setOptions] = useState(null)

  const handleChange = (e) => {
    if (e === null) {
      setSelectedDraft(false)
      return
    }
    setSelectedDraft(draftList.find(draft => draft.name === e.value))
  }

  const handleDelete = async () => {
    await doDeleteDraft()
    setOptions(options.filter(el => el.value !== selectedDraft.name))
    handleChange(null)
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
    doFetchDrafts()
  }, [updateDraft])

  useEffect(() => {
    if (loadingDraftList) return
    if (!errorDraftList) {
      setOptions(draftList.map((draft, index) => {
        return {
          value: draft.name,
          label: `${draft.name} - ${draft.language}`
        }
      }) )
    }
  }, [loadingDraftList])

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
          value={selectedDraft ? {
            value: selectedDraft.name,
            label: `${selectedDraft.name} - ${selectedDraft.language}`
          } :
          null}
          openMenuOnFocus={true}
           />
      { isDrafts ?
        <div className="">
          <button onClick={doFetchDraft} disabled={!selectedDraft}>Load</button>
          <ConfirmButton onClick={handleDelete} disabled={!selectedDraft} initialLabel='Delete' onConfirmLabel="Confirm"/>
        </div>
          :
        <p>No drafts saved yet</p>}
    </>
  )


}

export default LoadDraft;
