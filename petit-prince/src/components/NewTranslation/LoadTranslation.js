import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import { baseUrl } from '../Util/apiUrl';
import "./NewTranslation.css"

const LoadTranslation = ({id}) => {
  const [translation, setTranslation] = useState([])
  const [language, setLanguage] = useState('')

  const handleLanguageSelect = (lang) => {
    setLanguage(lang.name)
  }

  const handleClick = async (e) => {
    e.preventDefault()
    const response = await fetch(`${baseUrl}/translations/${language}`)
    const parseRes = await response.json()

    setTranslation(parseRes)
  }

  return (
    <div className="preview-compare" >
    <h3>Load translation</h3>
    <div className="load-preview-compare">
      <LanguageSelector selectLanguage={handleLanguageSelect} />
      <button type="button" onClick={handleClick}>Load</button>
    </div>
    {
      translation.length === 0 ? <p>Load the text in the language of your choice</p>
      : 
      <>
        {
          id > 0 && 
          <p style={{opacity:"50%"}}>{translation[id-1].text}</p>
        }
        {
          id < translation.length ?
        <p>{translation[id].text}</p>
          :
        <p>End of text. Click on 'Save translation' button to submit!</p>
        }
        {
          id + 1 < translation.length && 
          <p style={{opacity:"50%"}}>{translation[id+1].text}</p>
        }
      </>
    }
  </div>

  )
}

export default LoadTranslation;
