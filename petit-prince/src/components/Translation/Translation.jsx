import React, { useState, useEffect } from 'react';

import "./Translation.css"
import useFetchPictures from './useFetchPictures'

import Navbar from '../Navbar/Navbar'
import LoadTranslations from './LoadTranslations'
import DisplayText from './DisplayText'
import AudioPlayer from './AudioPlayer/AudioPlayer'
import LazyBackroundImage from '../Util/LazyBackroundImage'
import useStatusRecorder from '../Util/useStatusRecorder'
const background="/background/background.jpg"
const placeholder="/background/background.jpg"
const backgroundOptions = "linear-gradient( rgba(175,216,219,.2), rgba(175,216,219,.2) )"


const Translation = () => {
  const [data, setData] = useState(null)
  const [language, setLanguage] = useState(null)
  const { pictures } = useFetchPictures()
  const [currentId, setCurrentId] = useState(0)
  const [duration, setDuration] = useState(0)
  const {statusRecorder, setStatusRecorder, updateStatus} = useStatusRecorder()
  const [hasCurrent, setHasCurrent] = useState(false)

  useEffect(() => {
    setHasCurrent(statusRecorder.recordedAndInDb.includes(currentId))
  }, [currentId, statusRecorder])

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
      <LoadTranslations loadData={loadData} />
      <LazyBackroundImage
        className="translation-container"
        source={background}
        placeholder={placeholder}
        options={backgroundOptions}
      >
        <DisplayText
          data={data}
          pictures={pictures}
          currentId={currentId}
          changeCurrentId={changeCurrentId}
          statusRecorder={statusRecorder}
          duration={duration}
          />
      </LazyBackroundImage>
      {
        data &&
        <AudioPlayer
          language={language}
          languageId={data.idLanguageOne}
          setNext={setNext}
          currentId={currentId}
          statusRecorder={statusRecorder}
          updateStatus={updateStatus}
          duration={duration}
          setSentenceDuration={setSentenceDuration}
          length = {data.data.length}
          hasCurrent = {hasCurrent}
          />
      }


    </>
  )
}

export default Translation;
