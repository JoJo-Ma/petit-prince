import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import "./NewTranslation.css"

const LoadTranslation = ({id}) => {
  const [translation, setTranslation] = useState([])
  const [language, setLanguage] = useState('')

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
  }

  const handleClick = async (e) => {
    e.preventDefault()
    const response = await fetch(`http://localhost:3005/translations/${language}`)
    const parseRes = await response.json()

    setTranslation(parseRes)
  }

  return (
    <div className="preview-compare" >
    <h3>Load translation</h3>
    <div>
      <LanguageSelector selectLanguage={handleLanguageSelect} />
      <button type="button" onClick={handleClick}>Load</button>
    </div>
    {
      translation.length == 0 ? <p>Load the text in the language of your choice</p>
    : <p>{translation[id].text}</p>
    }
  </div>

  )
}

export default LoadTranslation;
