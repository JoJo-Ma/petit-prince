import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar'
import LoadTranslation from './LoadTranslation'
import DisplayText from './DisplayText'

import Recorder from './Recorder'

const Record = () => {
  const [audioToDb, setAudioToDb] = useState([])
  const [data, setData] = useState('')
  const [currentId, setCurrentId] = useState(0)


  const loadData = (input) => {
    setData(input)
  }

  const setNext = () => {
    setCurrentId(currentId + 1)
  }

  return (
    <>
      <Navbar />
      <h1>Record</h1>
      <p>Choose language to record</p>
      <LoadTranslation loadData={loadData} />
      <div className="translation-container">
        <DisplayText data={data} currentId={currentId}/>
      </div>
      <Recorder setNext={setNext}/>
    </>
  )
}

export default Record;
