import React, { useState, useEffect, useContext, useRef } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import {RecorderContext} from './Record'

const LoadTranslation = ({ loadData, updateStatus, statusRecorder }) => {
  const [languageOne, setLanguageOne] = useState(false)
  const {username} = useContext(RecorderContext)
  const isInitialMount = useRef(true);

  const selectLanguageOne = (lang) => {
    setLanguageOne(lang.name)
  }

  useEffect(() => {
    loadData("")
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3005/blobtesting/statusRecording/${username}/${languageOne}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      const data = parseRes.map(el => { return el.sentence_id})
      updateStatus(data, 'NewRecordedAndInDb')
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return
    }
    try {
      fetchData()
    } catch (error) {
      console.error(error.message);
    }
  }, [languageOne])

  const handleClick = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch (`http://localhost:3005/translations/${languageOne}/${languageOne}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      loadData(parseRes)
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <LanguageSelector selectLanguage={selectLanguageOne} />
      <button type="button" disabled={!languageOne && true } onClick={(e)=>handleClick(e)}>Load</button>
    </>
  )

}

export default LoadTranslation;
