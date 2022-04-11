import React, { useState } from 'react';

import "./Translation.css"
import useFetchPictures from './useFetchPictures'

import Navbar from '../Navbar/Navbar'
import LoadTranslations from './LoadTranslations'
import DisplayText from './DisplayText'
import AudioPlayer from './AudioPlayer'

import useStatusRecorder from '../utilAudio/useStatusRecorder'


const Translation = () => {
  const [data, setData] = useState(null)
  const [language, setLanguage] = useState(null)
  const { pictures } = useFetchPictures()
  const [currentId, setCurrentId] = useState(0)
  const [duration, setDuration] = useState(0)
  const {statusRecorder, setStatusRecorder, updateStatus} = useStatusRecorder()


  const loadData = (input, lang) => {
    setData(input)
    setLanguage(lang)
  }

  const setNext = () => {
    setCurrentId(currentId + 1)
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
      <h1>Translation</h1>
      <LoadTranslations loadData={loadData} />
      <div className="translation-container">
        <DisplayText
          data={data}
          pictures={pictures}
          currentId={currentId}
          changeCurrentId={changeCurrentId}
          statusRecorder={statusRecorder}
          duration={duration}
          />
      </div>
      {
        data &&
        <AudioPlayer
          language={language}
          setNext={setNext}
          currentId={currentId}
          statusRecorder={statusRecorder}
          updateStatus={updateStatus}
          setSentenceDuration={setSentenceDuration}
          />
      }
    </>
  )
}

export default Translation;
