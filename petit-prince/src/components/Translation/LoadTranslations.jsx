import React, { useState, useEffect } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';


export default () => {
  const [languageOne, setLanguageOne] = useState('')
  const [languageTwo, setLanguageTwo] = useState('')

  const selectLanguageOne = (lang) => {
    setLanguageOne(lang)
  }

  const selectLanguageTwo = (lang) => {
    setLanguageTwo(lang)
  }

  const handleClick = async (e) => {
    e.preventDefault()

    
  }

  return (
    <>
      <LanguageSelector selectLanguage={selectLanguageOne} />
      <LanguageSelector selectLanguage={selectLanguageTwo} />
      <button type="button" onClick={(e)=>handleClick(e)}>Load</button>
    </>
  )

}
