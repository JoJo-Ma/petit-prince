import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';


const LoadTranslation = ({ loadData, selectLanguage }) => {
  const [languageOne, setLanguageOne] = useState(false)
  const [languageTwo, setLanguageTwo] = useState(false)


  const selectLanguageOne = (lang) => {
    setLanguageOne(lang)
  }

  const selectLanguageTwo = (lang) => {
    setLanguageTwo(lang)
  }



  const handleClick = async (e) => {
    e.preventDefault()
    try {
      console.log(`http://localhost:3005/translations/${languageOne.name}/${languageTwo.name}`);
      const response = await fetch (`http://localhost:3005/translations/${languageOne.name}/${languageTwo.name}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      loadData(parseRes, languageOne)
    } catch (error) {
      console.error(error.message);
    }
  }

  const swap = () => {
    const one = languageOne
    setLanguageOne(languageTwo)
    setLanguageTwo(one)
  }

  return (
    <>
      <LanguageSelector selectLanguage={selectLanguageOne} language={languageOne}/>
      <button className="" onClick={swap}>Swap</button>
      <LanguageSelector selectLanguage={selectLanguageTwo} language={languageTwo}/>
      <button type="button" disabled={(!languageOne || !languageTwo) && true } onClick={(e)=>handleClick(e)}>Load</button>
    </>
  )

}

export default LoadTranslation;
