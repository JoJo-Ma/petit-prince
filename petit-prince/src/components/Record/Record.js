import React, { useState, useEffect, createContext } from 'react';
import { useStoreState } from 'easy-peasy';
import Navbar from '../Navbar/Navbar'
import LoadTranslation from './LoadTranslation'
import DisplayText from './DisplayText'


import Recorder from './Recorder'

const RecorderContext = createContext()

const Record = () => {
  const username = useStoreState(state => state.naming.name)
  const [data, setData] = useState('')
  const [currentId, setCurrentId] = useState(0)
  const [statusRecorder, setStatusRecorder] = useState({
    recorded: [],
    recordedAndInDb: []
  })

  const loadData = (input) => {
    setData(input)
  }

  const setNext = () => {
    setCurrentId(currentId + 1)
  }

  const changeCurrentId = (id) => {
    setCurrentId(id)
  }

  const updateStatus = (arrayOfIds, statusType) => {
    switch (statusType) {
      case 'AddRecordedAndInDb':
        setStatusRecorder({
          ...statusRecorder,
          recordedAndInDb: [...statusRecorder.recordedAndInDb, ...arrayOfIds]
        })
        break;
      case 'NewRecordedAndInDb':
        setStatusRecorder({
          ...statusRecorder,
          recordedAndInDb: [...arrayOfIds]
        })
        break;
      case 'AddRecorded':
        setStatusRecorder({
          ...statusRecorder,
          recorded: [...statusRecorder.recorded, ...arrayOfIds]
        })
        break;
      case 'NewRecorded':
        setStatusRecorder({
          ...statusRecorder,
          recorded: [...arrayOfIds]
        })
        break;
      default:
        setStatusRecorder({
          recorded: [],
          recordedAndInDb: []
        })
    }
  }

  return (
    <>
      <Navbar />
      <h1>Record</h1>
      <p>Choose language to record</p>
      <RecorderContext.Provider value={{username}} >
        <LoadTranslation loadData={loadData} updateStatus={updateStatus}/>
        <div className="translation-container">
          <DisplayText data={data} currentId={currentId} changeCurrentId={changeCurrentId} statusRecorder={statusRecorder}/>
        </div>
        <Recorder setNext={setNext} currentId={currentId} languageId={data.idLanguageOne} statusRecorder={statusRecorder}/>
      </RecorderContext.Provider>
    </>
  )
}

export default Record;
export {RecorderContext};
