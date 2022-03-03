import React, { useState, useEffect } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';


const LoadTranslation = ({ loadData }) => {
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
    try {
      console.log(`http://localhost:3005/translations/${languageOne}/${languageTwo}`);
      const response = await fetch (`http://localhost:3005/translations/${languageOne}/${languageTwo}`, {
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
      <LanguageSelector selectLanguage={selectLanguageTwo} />
      <button type="button" onClick={(e)=>handleClick(e)}>Load</button>
    </>
  )

}

export default LoadTranslation;
