import React, { useState, useEffect } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';


const LoadTranslation = ({ loadData }) => {
  const [languageOne, setLanguageOne] = useState(false)


  const selectLanguageOne = (lang) => {
    setLanguageOne(lang)
  }

  const handleClick = async (e) => {
    e.preventDefault()
    try {
      console.log(`http://localhost:3005/translations/${languageOne}/${languageOne}`);
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
