import React, { useState } from 'react';

import "./Translation.css"
import useFetchPictures from './useFetchPictures'

import Navbar from '../Navbar/Navbar'
import LoadTranslations from './LoadTranslations'
import DisplayText from './DisplayText'
import AudioPlayer from './AudioPlayer'



const Translation = () => {
  const [data, setData] = useState(null)
  const { pictures } = useFetchPictures()

  const loadData = (input) => {
    setData(input)
  }


  return (
    <>
      <Navbar />
      <h1>Translation</h1>
      <LoadTranslations loadData={loadData} />
      <div className="translation-container">
        <DisplayText data={data} pictures={pictures} />
      </div>
      <AudioPlayer data={data} />
    </>
  )
}

export default Translation;
