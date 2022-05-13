import React, { useState, createContext } from 'react';
import { useStoreState } from 'easy-peasy';
import Navbar from '../Navbar/Navbar'
import LoadTranslation from './LoadTranslation'
import DisplayText from './DisplayText'


import Recorder from './Recorder'
import useStatusRecorder from '../Util/useStatusRecorder'


const RecorderContext = createContext()

const Record = () => {
  const username = useStoreState(state => state.naming.name)
  const [data, setData] = useState('')
  const [currentId, setCurrentId] = useState(0)
  const [duration, setDuration] = useState(0)
  const {statusRecorder, setStatusRecorder, updateStatus} = useStatusRecorder()

  const loadData = (input) => {
    setData(input)
  }

  const setNext = () => {
    setCurrentId(currentId + 1)
  }

  const setNextNonRecorded = () => {
    const concatArray = statusRecorder.recorded.concat(statusRecorder.recordedAndInDb).sort((a, b) => {
        return a - b
    })
    const nextNonRecordedId = data.data.filter(item => !concatArray.includes(item.id))[0].id
    if (nextNonRecordedId) {
      setCurrentId(nextNonRecordedId)
    }
    return
  }

  const changeCurrentId = (id) => {
    setCurrentId(id)
  }

  const setSentenceDuration = (duration) => {
    setDuration(duration)
  }

  return (
    <>
      <Navbar />
      <h1>Record</h1>
      <p>Choose language to record</p>
      <RecorderContext.Provider value={{username}} >
        <LoadTranslation
          loadData={loadData}
          updateStatus={updateStatus}
          statusRecorder={statusRecorder}
        />
        <div className="translation-container">
          <DisplayText
            data={data}
            currentId={currentId}
            changeCurrentId={changeCurrentId}
            statusRecorder={statusRecorder}
            duration={duration}
          />
        </div>
        {
          data &&
          <Recorder
            setNext={setNext}
            setNextNonRecorded={setNextNonRecorded}
            currentId={currentId}
            languageId={data.idLanguageOne}
            statusRecorder={statusRecorder}
            updateStatus={updateStatus}
            setSentenceDuration={setSentenceDuration}
            />
        }
      </RecorderContext.Provider>
    </>
  )
}

export default Record;
export {RecorderContext};
